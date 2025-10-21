import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./utils/usersUtils";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import ActionButtons from "./ActionButtons";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { userGridApiAtom } from "../../store/common.store";

const UserTable = () => {
  const [, setGridApi] = useAtom(userGridApiAtom);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: Infinity,
  });

  const [colDefs] = useState([
    { field: "userEmail", flex: 1 },
    { field: "firstName" },
    { field: "lastName" },
    { field: "isActive", cellStyle: { align: "center" } },
    {
      colId: "actions",
      headerName: "Actions",
      cellRenderer: ActionButtons,
      width: 150,
    },
  ]);

  const rowSelection = useMemo(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={data || []}
          columnDefs={colDefs}
          rowSelection={rowSelection}
          onGridReady={onGridReady}
        />
      </div>
    </>
  );
};

export default UserTable;
