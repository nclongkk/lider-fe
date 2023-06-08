import {
  useLocation,
  useNavigate,
  useSearchParams,
  useParams,
} from "react-router-dom";

export const useRouter = () => {
  const navigate = useNavigate();
  const { pathname, state: locationState } = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const searchParamsObject = Object.fromEntries(searchParams.entries());

  return {
    params,
    pathname,
    locationState,
    searchParamsObject,
    navigate,
  };
};
