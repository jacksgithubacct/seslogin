import GraphiQLLink from "../../components/GraphiQLLink";
import ClientVersionLabel from "../../components/ClientVersionLabel";

export default function Footer() {
  return (
    <footer>
      NSW SES Volunteers &mdash; SES Activity v2 &mdash; <ClientVersionLabel />
      &mdash; <GraphiQLLink />
    </footer>
  );
}
