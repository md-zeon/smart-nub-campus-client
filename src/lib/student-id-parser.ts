import { AdmissionSemester } from "@/constants/enums";
import isStudentId from "./isStudentId";
import {
  getDepartmentByCode,
  getDepartmentMetadata,
} from "@/constants/departments";

export interface ParsedStudentIdResult {
  success: boolean;
  message: string;
  data: ParsedStudentId | null;
  error: {
    status: number;
    message: string;
  } | null;
}

export interface ParsedStudentId {
  department: {
    code: string;
    shortName: string;
    fullName: string;
  };
  admissionYear: number;
  admissionSemester: AdmissionSemester;
  serialNumber: number;
}

const ADMISSION_SEMESTER_CODES: Record<number, AdmissionSemester> = {
  10: AdmissionSemester.SPRING,
  20: AdmissionSemester.SUMMER,
  30: AdmissionSemester.FALL,
};

export const parseStudentId = (studentId: string): ParsedStudentIdResult => {
  // Validate first using isStudentId
  if (!isStudentId(studentId)) {
    return {
      success: false,
      message: "Invalid student ID format.",
      data: null,
      error: {
        status: 400,
        message: "Invalid student ID format.",
      },
    };
  }

  const departmentCode = studentId.substring(0, 2);
  const departmentShortName = getDepartmentByCode(departmentCode);
  // If the department short name is not found, return an error
  if (!departmentShortName) {
    return {
      success: false,
      message: "Invalid student ID format.",
      data: null,
      error: {
        status: 400,
        message: "Invalid student ID format.",
      },
    };
  }

  const yearPart = studentId.substring(2, 4);

  if (isNaN(parseInt(yearPart, 10))) {
    return {
      success: false,
      message: "Invalid student ID format.",
      data: null,
      error: {
        status: 400,
        message: "Invalid student ID format.",
      },
    };
  }
  const intakeSegment = studentId.substring(4, 7);
  const serialNumber = parseInt(studentId.substring(7, 11), 10);

  const department = getDepartmentMetadata(departmentShortName);
  const admissionYear = 2000 + parseInt(yearPart, 10);
  const semesterCode = parseInt(intakeSegment.substring(1), 10);
  const admissionSemester = ADMISSION_SEMESTER_CODES[semesterCode];

  return {
    success: true,
    message: "Student ID parsed successfully.",
    data: {
      department,
      admissionYear,
      admissionSemester,
      serialNumber,
    },
    error: null,
  };
};
