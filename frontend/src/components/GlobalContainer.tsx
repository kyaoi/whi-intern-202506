import { Container } from "@mui/material";
import { GlobalFooter } from "../components/GlobalFooter";
import { GlobalHeader } from "../components/GlobalHeader";
import { VerticalSpacer } from "../components/VerticalSpacer";

export function GlobalContainer({
	children,
	title,
}: { children?: React.ReactNode; title: string }) {
	return (
		<Container
			sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
		>
			<header>
				<GlobalHeader title={`タレントマネジメントシステム - ${title}`} />
			</header>

			<VerticalSpacer height={32} />

			<main>{children}</main>

			<footer>
				<GlobalFooter />
			</footer>
		</Container>
	);
}
