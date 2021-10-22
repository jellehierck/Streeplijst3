class Congressus {
  private csrfToken: string = "";

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

  // todo fetch all products by category/folder
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
