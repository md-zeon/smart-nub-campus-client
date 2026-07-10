import { getDepartmentByCode } from "@/constants/departments";
import { AdmissionSemester } from "@/constants/enums";

const ADMISSION_SEMESTER_CODES: Record<number, AdmissionSemester> = {
  10: AdmissionSemester.SPRING,
  20: AdmissionSemester.SUMMER,
  30: AdmissionSemester.FALL,
};

const isStudentId = (identifier: string): boolean => {
  // Must be exactly 11 digits
  if (!/^\d{11}$/.test(identifier)) {
    return false;
  }

  const departmentCode = identifier.substring(0, 2);
  const intakeSegment = identifier.substring(4, 7);

  // Check valid department code
  if (!getDepartmentByCode(departmentCode)) {
    return false;
  }

  // Check valid intake code (last 2 digits of 3-digit segment)
  const semesterCode = parseInt(intakeSegment.substring(1), 10);
  return !!ADMISSION_SEMESTER_CODES[semesterCode];
};

export default isStudentId;
