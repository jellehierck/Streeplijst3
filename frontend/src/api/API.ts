class Congressus {
  private csrfToken: string = "";
  private streeplijstFolders = [
    1991, 2600, 1993, 1996, 1994, 1997, 1995, 1992, 1998, 2464,
  ];

  private cache: { folders: any } = { folders: undefined };

  constructor(private API_HOST: string) {}

  // fetch member by username
  async getMemberByUsername(username: string) {
    if (!username || username.length < 3) throw new Error("invalid sNumber");

    return this.call(`/members/${username}`).then((member) => {
      if (!member[0]) throw new Error("invalid sNumber");
      return member[0];
    });
  }

  // fetch sales of member
  async getSalesByUsername(username: string) {
    if (!username || username.length < 3) throw new Error("invalid sNumber");

    return this.call(`/sales/${username}`).then((sales) => {
      if (sales.length < 1) throw new Error("invalid sNumber");
      return sales;
    });
  }

  // fetch all streeplijst folders
  async getFolders(): Promise<FolderType[]> {
    let folders = [];
    for (let folder_id of this.streeplijstFolders) {
      let firstProduct = (await this.getProductsByFolder(folder_id))[0];

      folders.push({
        id: firstProduct.folder_id,
        name: firstProduct.folder,
        media: firstProduct.media,
      });
    }

    return folders;
  }

  // todo fetch all streeplijst products by category/folder
  async getProductsByFolder(folder_id: number): Promise<ProductType[]> {
    if (this.cache.folders && this.cache.folders[folder_id])
      return this.cache.folders[folder_id];
    return this.call(`/products?folder_id=${folder_id}`).then((products) => {
      products = products
        .filter((product: ProductType) => product.published)
        .map((product: any) => {
          product.price = product?.offers[0]?.price || product.price;
          product.product_offer_id = product?.offers[0].id;
          return product;
        });

      if (!this.cache.folders) this.cache.folders = { [folder_id]: products };
      else this.cache.folders[folder_id] = products;

      return products;
    });
  }

  // todo add sale to member
  async addSaleToMember(member_id: number, items: ProductSaleType[]) {
    return this.call(`/sales/`, {
      method: "POST",
      body: JSON.stringify({ member_id, items }),
    });
  }

  private async call(url: string, options?: RequestInit) {
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

export default new Congressus("http://localhost:8000");

// only the fields we need
export interface FolderType {
  id: number;
  name: string;
  media: string;
}

export interface ProductType {
  id: number;
  product_offer_id: number;
  name: string;
  description: string;
  media: string; // would be array for different image sizes in v30
  price: number;
  folder_id: number;
  folder: string;
  published: boolean;
}

export interface ProductSaleType {
  product_offer_id: number;
  quantity: number;
}

export interface UserType {
  date_of_birth: string;
  first_name: string;
  has_sdd_mandate: boolean;
  id: number;
  primary_last_name_main: string;
  primary_last_name_prefix: string;
  profile_picture: any;
  show_almanac: boolean;
  status: string;
  status_id: number;
  username: string;
}
