import React from "react";
import {
  Location,
  NavigateFunction,
  Params,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

export interface RouterProp {
  location: Location;
  navigate: NavigateFunction;
  params: Readonly<Params<string>>;
}

export interface WithRouterProps {
  router: RouterProp;
}

export function withRouter<P extends WithRouterProps>(
  WrappedComponent: React.ComponentType<P>
) {
  function ComponentWithRouterProp(
    props: Omit<P, keyof WithRouterProps>
  ) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <WrappedComponent
        {...(props as P)}
        router={{ location, navigate, params }}
      />
    );
  }

  const wrappedName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ComponentWithRouterProp.displayName = `withRouter(${wrappedName})`;

  return ComponentWithRouterProp;
}
