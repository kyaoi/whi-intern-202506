import { AddEmployeeForm } from "@/components/AddEmployee";
import { BackToRootButton } from "@/components/BackToRoot";
import { GlobalContainer } from "@/components/GlobalContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "タレントマネジメントシステム | 社員追加",
	description: "シンプルなタレントマネジメントシステム",
};

export default function AddEmployeePage() {
	return (
		<GlobalContainer title="社員追加">
			<BackToRootButton />
			<AddEmployeeForm />
		</GlobalContainer>
	);
}
