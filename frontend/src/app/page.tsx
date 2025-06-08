import { SearchEmployees } from "../components/SearchEmployees";
import { AddEmployeeForm } from "../components/AddEmployee";
import { GlobalContainer } from "@/components/GlobalContainer";

export default function Home() {
  return (
    <GlobalContainer>
      <SearchEmployees />
    </GlobalContainer>
  );
}
