import { AddEmployeeForm } from "@/components/AddEmployee";
import { GlobalContainer } from "@/components/GlobalContainer";
import { BackToRootButton } from "@/components/BackToRoot";
export default function AddEmployeePage() {
  return (
    <GlobalContainer>
      <BackToRootButton />
      <AddEmployeeForm />
    </GlobalContainer>
  );
}
