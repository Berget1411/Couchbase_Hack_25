// import { baseBackendFetch } from "./base-backend-fetch";

export const chatFetch = async (message: string) => {
  // const response = await baseBackendFetch("/chat", {
  //   method: "POST",
  //   body: JSON.stringify({ message }),
  // });

  // return response;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    your_message: message,
  };
};
