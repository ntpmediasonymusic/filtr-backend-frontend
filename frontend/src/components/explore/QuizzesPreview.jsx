import { NavLink } from "react-router-dom";
import { useSortedQuizzes } from "../../hooks/quizzes/useSortedQuizzes";

const QuizzesPreview = () => {
  const quizzes = useSortedQuizzes().slice(0, 3);
  return (
    <>
      <h2 className="pb-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-yellow-600 to-violet-600 bg-clip-text text-transparent">
        Quizzes
      </h2>
      <div className="flex flex-col bg-[#1f1f1f] rounded-lg shadow-lg  p-6 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Títulos */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-white">
                ¿Cansado de escuchar Música?
              </h2>
              <p className="text-sm md:text-lg text-gray-300 mb-6">
                Diviértete contestando nuestros quizzes musicales.
              </p>
            </div>
            {/* Botón para explorar más quizzes */}
            <NavLink to="/quizzes">
              <button className="w-full px-4 py-2 bg-[#f8cd28] text-black font-bold rounded-lg hover:bg-[#ffeda8] transition">
                Explorar más Quizzes
              </button>
            </NavLink>
          </div>
          {/* Quizzes Banners */}
          <div className="md:w-1/2 flex flex-col">
            {quizzes.map((quiz) => (
              <a
                key={quiz.QuizName}
                href={quiz.urlQuiz}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <img
                  src={quiz.urlQuizImage}
                  alt={quiz.QuizName}
                  className="w-full h-auto rounded-lg transition transform hover:scale-105"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizzesPreview;
