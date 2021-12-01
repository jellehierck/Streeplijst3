class Congressus {
  private csrfToken: string = "";
  private streeplijstFolders = [
    1991, 2600, 1993, 1996, 1994, 1997, 1995, 1992, 1998, 2464,
  ];

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
  async getFolders() {
    let folders = [];
    for (let folder_id of this.streeplijstFolders) {
      let firstProduct = (
        await this.call(`/products?folder_id=${folder_id}`)
      )[0];

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
    return this.call(`/products?folder_id=${folder_id}`);
  }

  // todo add sale to member

  private async call(url: string, options?: RequestInit) {
    const response = await fetch(`${this.API_HOST}/streeplijst${url}`, {
      credentials: "include",
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        ...(options?.method === "POST"
          ? { "X-CSRF-Token": await this.getCsrfToken() }
          : {}), // this is really ugly
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

export interface ProductsType {}

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
