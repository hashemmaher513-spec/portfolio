import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get("portfolio_locale")?.value;

  if (savedLocale === "en" || savedLocale === "ar") {
    redirect(`/${savedLocale}`);
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") || "";
  
  if (acceptLanguage.startsWith("en")) {
    redirect("/en");
  }

  redirect("/ar");
}
