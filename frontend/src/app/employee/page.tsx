import { BackToRootButton } from "@/components/BackToRoot";
import { EmployeeDetailsContainer } from "@/components/EmployeeDetailsContainer";
import { GlobalContainer } from "@/components/GlobalContainer";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "タレントマネジメントシステム | 社員詳細",
	description: "シンプルなタレントマネジメントシステム",
};

export default function EmployeePage() {
	return (
		<GlobalContainer title="社員詳細">
			<BackToRootButton />
			{/* Mark EmployeeDetailsContainer as CSR */}
			<Suspense>
				<EmployeeDetailsContainer />
			</Suspense>
		</GlobalContainer>
	);
}
