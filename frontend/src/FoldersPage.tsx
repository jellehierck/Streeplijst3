import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import congresssus, { FolderType, UserType } from "./api/API";

export function FoldersPage(props: any) {
  const sNumber = localStorage.getItem("sNumber");
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    congresssus.getMemberByUsername(sNumber || "").then((x) => {
      setMember(x);
      setLoading(false);
    });
  });

  const user = (
    <div>
      <p className="font-semibold">
        {member?.first_name} ({member?.username})
      </p>
      <button className="bg-red-700 p-2 text-white rounded-lg">Log uit</button>
    </div>
  );

  return (
    <div className="p-5">
      <div className="">
        <h1 className="inline-block">Categories</h1>
        <div className="w-max mx-2 inline-block float-right">
          {loading ? <Spinner animation="border"></Spinner> : user}
        </div>
      </div>
      <div className="mx-auto  text-center grid grid-cols-4 gap-5">
        {props.folders.map((x: FolderType) => (
          <div className="w-full p-5 justify-center flex-wrap bg-gray-100 rounded-lg">
            <img className="h-40 block mx-auto" src={x.media} alt={x.name} />
            <p className="font-bold text-xl">{x.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
