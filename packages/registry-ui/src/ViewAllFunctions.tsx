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
  const { loading, error, data } = useFetch<Record<string, boolean>>(API_V1("/functions"), {}, []);

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
