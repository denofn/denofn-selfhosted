import React from "react";
import { useFetch } from "use-http";

import { Container } from "./components/Container";
import { Error } from "./components/Error";
import { Function } from "./components/Function";
import { Loading } from "./components/Loading";
import { ViewsContext } from "./components/Views";
import { RegistryJSON } from "./types";
import { API_V1 } from "./utils/prefixes";

export function ViewManageFunction() {
  const [{ manage: scriptName }] = React.useContext(ViewsContext);
  const { get, loading, error, data, response } = useFetch<{
    index: string;
    registry: RegistryJSON;
    isWarmedUp: boolean;
  }>(API_V1(`/functions/${scriptName}`), {});

  const loadFn = React.useCallback(async () => {
    await get();
  }, [get]);

  React.useEffect(() => {
    loadFn();
  }, [loadFn]);

  return (
    <Container>
      {loading && <Loading />}
      {error && <Error title="Error!" message={error!.message} />}
      {!loading && !error && !!data && response.ok && (
        <Function scriptName={`${scriptName}`} {...data} reload={loadFn} />
      )}
    </Container>
  );
}
