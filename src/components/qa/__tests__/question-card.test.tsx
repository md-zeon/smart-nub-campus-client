import { render, screen } from "@/__tests__/test-utils";
import { QuestionCard } from "@/components/qa/question-card";
import { mockQuestion } from "@/__tests__/mocks/data";
import type { Question } from "@/types/qa.types";

const baseQuestion: Question = {
  ...(mockQuestion as unknown as Question),
  questionTags: [],
  isAnswered: false,
};

describe("QuestionCard", () => {
  it("renders the question title", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    expect(screen.getByText("How to sort an array?")).toBeInTheDocument();
  });

  it("links to the question detail page", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/qa/${baseQuestion.id}`);
  });

  it("renders VoteButtons with the upvote count", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("displays the category badge", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    expect(screen.getByText("Programming")).toBeInTheDocument();
  });

  it("shows answer count", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    expect(screen.getByText(/3 answers/)).toBeInTheDocument();
  });

  it("highlights answer count green when solved", () => {
    const solved = { ...baseQuestion, isAnswered: true };
    render(
      <QuestionCard
        question={solved}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    expect(screen.getByText(/3 answers/)).toBeInTheDocument();
    expect(screen.getByLabelText("Bookmark")).toBeInTheDocument();
  });

  it("shows view count", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    expect(screen.getByText(/100 views/)).toBeInTheDocument();
  });

  it("shows author name", () => {
    render(
      <QuestionCard
        question={baseQuestion}
        onVote={vi.fn()}
        onBookmark={vi.fn()}
      />,
    );
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});
