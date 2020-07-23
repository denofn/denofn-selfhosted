import React from "react";
import { useFetch } from "use-http";

import { Container } from "./components/Container";
import { Error } from "./components/Error";
import { FunctionPancake } from "./components/FunctionPancake";
import { Loading } from "./components/Loading";
import { RAM } from "./components/RAM";
import { API_V1 } from "./utils/prefixes";

export function ViewAllFunctions() {
  const { loading, error, data } = useFetch<Record<string, boolean>>(API_V1("/functions"), {}, []);

  return (
    <Container>
      {loading && <Loading />}
      {error && <Error title="Error!" message={error!.message} />}
      {!loading && !error && !!data && (
        <RAM>
          {Object.keys(data).map((f) => (
            <FunctionPancake status={data[f]} f={f} key={f} />
          ))}
        </RAM>
      )}
    </Container>
  );
}
