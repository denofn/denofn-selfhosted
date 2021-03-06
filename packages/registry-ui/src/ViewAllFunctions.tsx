import { Auth0ContextInterface, useAuth0 } from "@auth0/auth0-react";
import { css } from "otion";
import React from "react";
import { useFetch } from "use-http";

import { Container } from "./components/Container";
import { CreateFunctionButton } from "./components/CreateFunctionButton";
import { Error } from "./components/Error";
import { FunctionPancake } from "./components/FunctionPancake";
import { Loading } from "./components/Loading";
import { Pancake } from "./components/Pancake";
import { RAM } from "./components/RAM";
import { API_V1 } from "./utils/prefixes";

export function ViewAllFunctions() {
  const { isAuthenticated, user } = useAuth0();
  if (isAuthenticated) return <ViewAllFunctionsInternal isAuthenticated user={user} />;
  else return <div />;
}

function ViewAllFunctionsInternal({ isAuthenticated, user }: Pick<Auth0ContextInterface, "user" | "isAuthenticated">) {
  const { get, loading, error, data } = useFetch<Record<string, boolean>>(API_V1("/functions"), {
    headers: {
      "x-denofn-user": user?.sub,
    },
  });

  React.useEffect(() => {
    if (isAuthenticated) get();
  }, [isAuthenticated, get]);

  return (
    <Container>
      {loading && <Loading />}
      {error && <Error title="Error!" message={error!.message} />}
      {!loading && !error && !!data && (
        <>
          <RAM>
            {[
              ...Object.keys(data).map((f) => <FunctionPancake status={data[f]} f={f} key={f} />),
              <Pancake key="denofn-createNewFunctionAction-viewallfunctions">
                <div
                  className={css({
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "4rem",
                  })}
                >
                  <CreateFunctionButton />
                </div>
              </Pancake>,
            ]}
          </RAM>
        </>
      )}
    </Container>
  );
}
