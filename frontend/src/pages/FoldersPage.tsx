import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import congresssus, { FolderType, UserType } from "../api/API";
import { Sidebar } from "../components/Sidebar";

export function FoldersPage(props: any) {
  const sNumber = localStorage.getItem("sNumber");
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<UserType | undefined>(undefined);
  const history = useHistory();

  useEffect(() => {
    console.log("use effect is executed :DDD", loading);
    setLoading(false);
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="m-3 pl-28">
      <p className="inline-block font-bold">Categories</p>
      <div className="w-max h-full mx-2 float-right top-0">
        <Sidebar />
      </div>
      {/* <div className="mx-auto  text-center grid grid-cols-4 gap-5"> */}
      <div
        className="mt-2 grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, 15rem)",
        }}
      >
        {props.folders.map((x: FolderType) => (
          // <div
          //   key={x.id}
          //   className="w-full p-5 justify-center flex-wrap bg-gray-100 rounded-lg"
          // >
          //   <img className="h-40 block mx-auto" src={x.media} alt={x.name} />
          //   <p className="font-bold text-xl">{x.name}</p>
          // </div>
          <Card
            style={{
              width: "15rem",
              borderRadius: "0.5rem",
              // backgroundColor: "#a3ffd1",
            }}
            className="p-3"
            key={x.id}
            onClick={() => {
              console.log(x.id);
              history.push(`/folders/${x.id}`);
            }}
          >
            <Card.Body>
              <Card.Title>{x.name}</Card.Title>
            </Card.Body>
            <Card.Img variant="bottom" src={x.media} />
          </Card>
        ))}
      </div>
      {/* </div> */}
    </div>
  );
}
