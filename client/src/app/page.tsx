import Link from "next/link";
export default function Home() {
  return (
    <div>
      <Link href={"/admin"}>admin</Link><br></br>
      <Link href={"/sales_user"}>sales</Link>
    </div>
  );
}
