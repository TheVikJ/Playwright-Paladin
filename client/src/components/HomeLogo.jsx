import { Header } from "./UI/Typography";

function HomeLogo() {
  return (
    <section
      className={
        "fixed l-0 t-0 h-screen flex flex-col w-1/6 z-10 items-center justify-items-center"
      }
    >
      <span className={"my-auto block"}>
        <img alt={"Logo"} src={"/logo.png"} className={"w-48"} />
        <Header ariaLabel={"Playright Paladin: Write Effectively!"}>
          Playwright Paladin
        </Header>
        <p className={"mt-1 text-md text-gray-600 text-center"}>
          Write effectively!
        </p>
      </span>
    </section>
  );
}

export default HomeLogo;
