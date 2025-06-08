import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import { Suspense } from "react";
import { BackToRootButton } from "@/components/BackToRoot";
export default function EmployeePage() {
  return (
    <GlobalContainer>
      <BackToRootButton />
      {/* Mark EmployeeDetailsContainer as CSR */}
      <Suspense>
        <EmployeeDetailsContainer />
      </Suspense>
    </GlobalContainer>
  );
}
