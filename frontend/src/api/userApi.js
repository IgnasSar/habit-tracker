export async function registerUser(data) {
  const response = await fetch("http://localhost/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let resData = {};
  try {
    resData = await response.json();
  } catch (parseError) {
    console.warn("Response is not valid JSON:", parseError);
  }

  if (!response.ok) {
    const errorData = resData || { message: "Registration failed." };

    try {

      const parsed = errorData.errors || JSON.parse(errorData.message).errors;
      
      if (parsed)
        throw new Error(JSON.stringify({ errors: parsed }));

    } catch {
      throw new Error(errorData.message || "Registration failed.");
    }
  }

  return resData;
}
