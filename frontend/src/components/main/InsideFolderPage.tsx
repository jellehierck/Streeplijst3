import React from "react";
// import congressus, { ProductType } from "../api/API";
// import { Sidebar } from "../components/Sidebar";
// import { ShoppingCartContext } from "../contexts/ShoppingCartContext";

export function InsideFolderPage(props : any) {
  // const sNumber = localStorage.getItem("sNumber");
  // const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();
  // let {folderId} = useParams(); // TODO useParams() doesn't have the correct type
  //
  // const [products, setProducts] = useState<any | undefined>([]);
  // const [cart, setCart] = useContext(ShoppingCartContext);
  //
  // const addToShoppingCart = (product : ProductType) => {
  //   setCart([...cart, product]);
  // };
  //
  // useEffect(() => {
  //   console.log("use effect is executed :DDD", loading);
  //   setLoading(true);
  //   setLoading(false);
  //
  //   // Promise.all([
  //   //   congressus.getProductsByFolder(+folderId).then((products) => {
  //   //     setProducts(products);
  //   //   }),
  //   // ]).then(() => {
  //   //   setLoading(false);
  //   // });
  // }, []);
  //
  // let folderName = products[0]?.folder;
  //
  // if (loading) return <Spinner animation="border" />;
  //
  // return (
  //   <div className="m-3 w-full">
  //     <Button
  //       className="float-left mr-5"
  //       variant="info"
  //       onClick={() => {
  //         navigate("/folders");
  //       }}
  //     >
  //       Terug
  //     </Button>
  //     <p className="inline-block font-bold">{folderName}</p>
  //     <div className="w-max float-right">
  //       <Sidebar />
  //     </div>
  //     {/* <div className="mx-auto  text-center grid grid-cols-4 gap-5"> */}
  //
  //     <div
  //       className="mt-2 grid gap-2"
  //       style={{
  //         gridTemplateColumns: "repeat(auto-fill, 15rem)",
  //       }}
  //     >
  //       {products.map((product : ProductType) => {
  //         // <div
  //         //   key={x.id}
  //         //   className="w-full p-5 justify-center flex-wrap bg-gray-100 rounded-lg"
  //         // >
  //         //   <img className="h-40 block mx-auto" src={x.media} alt={x.name} />
  //         //   <p className="font-bold text-xl">{x.name}</p>
  //         // </div>
  //         //   console.log(product);
  //         return <Card
  //           style={{
  //             width: "14.5rem",
  //             borderRadius: "0.5rem",
  //             // backgroundColor: "#a3ffd1",
  //           }}
  //           className="p-3 shadow-sm"
  //           key={product.id}
  //           onClick={() => addToShoppingCart(product)}
  //         >
  //           <Card.Body>
  //             <Card.Title>{product.name}</Card.Title>
  //           </Card.Body>
  //           <Card.Img variant="bottom" src={product.media} />
  //           <div className="flex mt-1">
  //             <Button
  //               variant="success"
  //               className="w-full"
  //               onClick={() => {
  //                 addToShoppingCart(product);
  //               }}
  //             >
  //               +
  //             </Button>
  //             <Button variant="secondary">
  //               €{(product.price / 100).toFixed(2)}
  //             </Button>
  //           </div>
  //         </Card>
  //       })}
  //     </div>
  //     {/* </div> */}
  //   </div>
  // );
}
