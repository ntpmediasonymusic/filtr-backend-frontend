/* eslint-disable react/prop-types */
import ReactPaginate from "react-paginate";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Paginate = ({ pageCount, handlePageClick }) => {
  return (
    <div className="flex justify-center mt-4">
      <ReactPaginate
        previousLabel={<FaChevronLeft />}
        nextLabel={<FaChevronRight />}
        breakLabel={<span className="text-white text-lg">...</span>}
        pageCount={pageCount}
        marginPagesDisplayed={1} // Menos páginas visibles antes de los puntos
        pageRangeDisplayed={2} // Menos páginas consecutivas visibles
        onPageChange={handlePageClick}
        containerClassName={"pagination flex space-x-2"}
        pageClassName={"page-item"}
        pageLinkClassName={
          "px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-pink-600"
        }
        activeLinkClassName={"bg-pink-600 text-white font-bold"}
        previousLinkClassName={
          "flex items-center justify-center px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-pink-600"
        }
        nextLinkClassName={
          "flex items-center justify-center px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-pink-600"
        }
        disabledClassName={"opacity-50 cursor-not-allowed"}
      />
    </div>
  );
};

export default Paginate;
