class SupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this.params = { table };
    this.method = 'GET';
    this.body = null;
  }

  select(fields = '*', options = {}) {
    this.params.select = fields;
    if (options.count === 'exact' && options.head === true) {
      this.params.countOnly = 'true';
    }
    return this;
  }

  eq(column, value) {
    this.params.filterCol = column;
    this.params.filterVal = value;
    return this;
  }

  order(column, options = {}) {
    this.params.orderCol = column;
    this.params.ascending = options.ascending !== false ? 'true' : 'false';
    return this;
  }

  limit(num) {
    this.params.limit = num;
    return this;
  }

  async single() {
    this.params.single = 'true';
    const res = await this.execute();
    return { data: res.data ? (Array.isArray(res.data) ? res.data[0] : res.data) : null, error: res.error };
  }

  async insert(dataArray) {
    this.method = 'POST';
    this.body = dataArray;
    return this.execute();
  }

  async update(dataObj) {
    this.method = 'PUT';
    this.body = dataObj;
    return this.execute();
  }

  async delete() {
    this.method = 'DELETE';
    return this.execute();
  }

  async upsert(dataArrayOrObj) {
    this.method = 'POST';
    this.params.upsert = 'true';
    this.body = dataArrayOrObj;
    return this.execute();
  }

  async execute() {
    try {
      const urlParams = new URLSearchParams();
      Object.keys(this.params).forEach(key => {
        if (this.params[key] !== undefined && this.params[key] !== null) {
          urlParams.append(key, this.params[key]);
        }
      });
      const url = `/api/db/${this.table}?${urlParams.toString()}`;
      const options = {
        method: this.method,
        headers: {},
      };
      if (this.body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(this.body);
      }
      const response = await fetch(url, options);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return { data: null, error: { message: errData.error || response.statusText } };
      }
      const resData = await response.json();
      return { 
        data: resData.data, 
        error: null, 
        count: resData.count !== undefined ? resData.count : (resData.data ? resData.data.length : 0) 
      };
    } catch (err) {
      console.error('API query client error:', err);
      return { data: null, error: { message: err.message } };
    }
  }

  // Standard thenable interface to support standard awaits on chain
  then(onfulfilled, onrejected) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

const storage = {
  from(bucket) {
    return {
      async upload(filePath, file) {
        try {
          // Convert file to Base64 in frontend
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
          });

          // Upload Base64 to Vercel API
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath, base64 }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return { data: null, error: { message: errData.error || response.statusText } };
          }
          const resData = await response.json();
          return { data: resData, error: null };
        } catch (err) {
          return { data: null, error: { message: err.message } };
        }
      },
      getPublicUrl(filePath) {
        // Return routing path to Vercel files endpoint
        return { data: { publicUrl: `/api/files/${filePath}` } };
      }
    };
  }
};

const auth = {
  async signOut() {
    return { error: null };
  }
};

export const supabase = {
  from(table) {
    return new SupabaseQueryBuilder(table);
  },
  storage,
  auth
};
