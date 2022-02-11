import axios from "axios";

// Folder information
type FolderType = {
  id : number
  name : string
  parent_id : number
  published : boolean
  path : string
  media? : string  // TODO: Add a way to add media to the folders and configure that in some way
  children? : string[] | null  // TODO: check if this type is correct and/or necessary
}

// Product information
type ProductType = {
  id : number
  product_offer_id : number
  name : string;
  description? : string | null
  published : boolean
  media? : string | null | null[]  // TODO: Remove returning empty array in Python API
  price : number
}

// Sale information
type SaleType = {
  member_id : number
  items : SaleItemType[]
}

// Product sale data
type  SaleItemType = {
  product_offer_id : number
  quantity : number
}

// User type
type MemberType = {
  id : number;
  username : string
  first_name : string
  last_name : string
  prefix? : string | null
  suffix? : string | null
  date_of_birth : string
  show_almanac : boolean
  status : MemberStatusType
  profile_picture? : string
  bank_account? : null  // TODO: add bank account information if needed
}

// User status type
type MemberStatusType = {
  archived : boolean,
  member_from : string,
  member_to : string | null,
  name : string,
  status_id : number,
}


/**
 * TODO
 */
class Congressus {
  private csrfToken : string = "";
  private streeplijstFolders = [
    1991, 2600, 1993, 1996, 1994, 1997, 1995, 1992, 1998,
  ];

  private cache : { folders : any } = {folders: undefined};

  constructor(private API_HOST : string) {
  }

  async getMemberByUsername(username : string) {
    axios.get(`${this.API_HOST}/streeplijst/v30/`);
  }

  /**
   * fetch member by username
   * @param username
   */
  async getMemberByUsernameOld(username : string) {
    // Make a request and get the response
    return this.request(`/v30/members/username/${username}`)
      .then((res) => {
        return res.json();
      })
      .catch((error) => {
        // Throw a not found error
        throw new Error(error);
      });

    // return this.call(`/v20/members/username/${username}`).then((member) => {
    //   // if (!member[0]) throw new Error("invalid number");
    //   // return member[0];
    //   if (!member) throw new Error("invalid number");
    //   return member;
    // });
  }

  /**
   * fetch sales of member
   * @param username
   */
  async getSalesByUsername(username : string) {
    if (!username || username.length < 3) throw new Error("invalid number");

    return this.call(`/v20/sales/${username}`).then((sales) => {
      if (sales.length < 1) throw new Error("invalid number");
      return sales;
    });
  }

  /**
   * fetch all streeplijst folders
   */
  async getFolders() : Promise<FolderType[]> {
    let folders : FolderType[] = [];
    // for (let folder_id of this.streeplijstFolders) {
    //   let firstProduct = (await this.getProductsByFolder(folder_id))[0];
    //
    //   folders.push({
    //     id: firstProduct.folder_id,
    //     name: firstProduct.folder,
    //     media: firstProduct.media,
    //   });
    // }

    return folders;
  }

  /**
   * todo fetch all streeplijst products by category/folder
   * @param folder_id
   */
  async getProductsByFolder(folder_id : number) : Promise<ProductType[]> {
    if (this.cache.folders && this.cache.folders[folder_id])
      return this.cache.folders[folder_id];
    // return this.call(`/v20/products?folder_id=${folder_id}`).then((products) => {
    return this.call(`/v20/products/folder/${folder_id}`).then((products) => {
      console.log(products);
      products = products
        .filter((product : ProductType) => product.published)
        .map((product : any) => {
          // product.price = product?.offers[0]?.price || product.price;
          product.price = product?.offers[0]?.price;
          product.product_offer_id = product?.offers[0].id;
          return product;
        });

      if (!this.cache.folders) this.cache.folders = {[folder_id]: products};
      else this.cache.folders[folder_id] = products;

      return products;
    });
  }

  /**
   * todo add sale to member
   * @param member_id
   * @param items
   */
  async addSaleToMember(member_id : number,
    items : SaleItemType[]) {
    return this.call(`/v30/sales`, {
      method: "POST",
      body: JSON.stringify({member_id, items}),
    });
  }

  /**
   * Make request to the Congressus API and return the Promise instance (for error catching)
   * @param url
   * @param options
   * @private
   */
  private async request(url : string,
    options? : RequestInit) {
    return await fetch(`${this.API_HOST}/streeplijst${url}`, {
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        // ...(options?.method === "POST"
        //   ? { "X-CSRF-Token": await this.getCsrfToken() }
        //   : {}), // this is really ugly
        ...options?.headers,
      },
    });
  }

  /**
   * Make request to the Congressus API and return the response data (strips all HTTP status information)
   * @param url
   * @param options
   * @private
   */
  private async call(url : string,
    options? : RequestInit) {
    const response = await fetch(`${this.API_HOST}/streeplijst${url}`, {
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        // ...(options?.method === "POST"
        //   ? { "X-CSRF-Token": await this.getCsrfToken() }
        //   : {}), // this is really ugly
        ...options?.headers,
      },
    });

    return response.json();
  }

  /**
   * todo
   * @private
   */
  private async getCsrfToken() {
    if (!this.csrfToken) {
      const response = await fetch(`${this.API_HOST}/csrf/`, {
        credentials: "include",
      });
      const data = await response.json();
      this.csrfToken = data.csrfToken;
    }
    return this.csrfToken;
  }
}

const congressus = new Congressus("http://localhost:8000");

// Exports
export default congressus;
export type { MemberType, MemberStatusType, FolderType, ProductType, SaleItemType, SaleType };