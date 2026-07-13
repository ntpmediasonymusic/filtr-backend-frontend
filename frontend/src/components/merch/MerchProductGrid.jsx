/* eslint-disable react/prop-types */
import MerchProductCard from "./MerchProductCard";

export default function MerchProductGrid({ products }) {
  return (
    <div className="2xl:flex 2xl:justify-center 2xl:w-[100%]">
      <div className="2xl:max-w-[80%] w-full">
        <div className="grid justify-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[14px] xl:gap-x-[24px] gap-y-[30px]">
          {products.map((product) => (
            <MerchProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
