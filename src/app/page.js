import Image from "next/image";
import Banner from "./components/Banner";
import CategorySection from "./components/CategorySection";
import NewArrivals from "./components/NewArrivals";

export default function Home() {
  return (
    <div>
     <Banner></Banner>
     <CategorySection></CategorySection>
     <NewArrivals></NewArrivals>
    </div>
  );
}
