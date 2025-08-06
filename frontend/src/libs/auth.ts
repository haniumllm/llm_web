type LoginFn = (email: string, token: string) => void;

export async function loginUser(
  email: string,
  password: string,
  login: LoginFn
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("로그인 실패");

  const data: { user: { email: string }; token: string } = await res.json();

  login(data.user.email, data.token);
}
