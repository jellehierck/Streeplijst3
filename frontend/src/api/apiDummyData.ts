import { FolderType, MemberType, ProductType } from "./API";

const member1 : MemberType = {
  id: 347980,
  username: "s9999999",
  first_name: "Test",
  last_name: "het Testaccount",
  date_of_birth: "1940-09-26",
  show_almanac: false,
  status: {
    archived: false,
    member_from: "2019-07-28T00:00:00",
    member_to: null,
    name: "Testaccount",
    status_id: 2767,
  },
};

const member2 : MemberType = {
  id: 288472,
  username: "s1779397",
  first_name: "Jelle",
  last_name: "Hierck",
  prefix: null,
  suffix: null,
  date_of_birth: "1998-07-16",
  show_almanac: true,
  status: {
    archived: false,
    member_from: "2016-09-02T00:00:00",
    member_to: null,
    name: "Primair lid",
    status_id: 2219,
  },
};

const members = [member1, member2];

const folder1 : FolderType = {
  children: [],
  id: 1998,
  name: "Speciaal",
  parent_id: 1989,
  path: "streeplijst-pk/speciaal",
  published: true,
  media: "https://congressus-paradoksutwente.s3-eu-west-1.amazonaws.com/files/63b78b80f2224dff8c46bfb8456d0bc8.png",
};

const folder2 : FolderType = {
  children: [],
  id: 2464,
  name: "Super Healthy",
  parent_id: 1989,
  path: "streeplijst-pk/super-healthy",
  published: true,
};

const folders = [folder1, folder2];

const product1 : ProductType = {
  id: 13591,
  product_offer_id: 14839,
  name: "Testproduct",
  description: null,
  published: true,
  price: 0.0,
  media: "",
};

const product2 : ProductType = {
  id: 15009,
  product_offer_id: 16379,
  name: "Zonnebril",
  description: null,
  published: true,
  price: 1.89,
  media: "https://congressus-paradoksutwente.s3-eu-west-1.amazonaws.com/files/63b78b80f2224dff8c46bfb8456d0bc8.png",
};

const product3 : ProductType = {
  id: 21151,
  product_offer_id: 23902,
  name: "Testproduct2 maar dan een lange naam",
  description: null,
  published: false,
  price: 0.0,
  media: "https://congressus-paradoksutwente.s3-eu-west-1.amazonaws.com/files/63b78b80f2224dff8c46bfb8456d0bc8.png",
};

const productsSpeciaal = [product1, product2, product3, product1, product1, product2];

export { members, member2, member1, product3, product2, product1, productsSpeciaal, folder1, folder2, folders };