import { useEffect } from "react";
import Quiz from "../components/quizzes/Quiz";
import { useSortedQuizzes } from "../hooks/quizzes/useSortedQuizzes";

const Quizzes = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sortedQuizzes = useSortedQuizzes();
  return (
    <div className="flex flex-col gap-[50px] md:gap-[100px] px-6 py-[50px] md:py-[50px]">
      {sortedQuizzes.map((quiz) => (
        <Quiz key={quiz.QuizName} {...quiz} />
      ))}
    </div>
  );
};

export default Quizzes;
