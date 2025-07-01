import { useQuery } from "@tanstack/react-query";
import { getStars } from "@/lib/api/github-service";

export const useGithubStars = () => {
  const { data: stars } = useQuery({
    queryKey: ["stars"],
    queryFn: () => getStars(),
  });

  return stars;
};
