const fs = require('fs');
let code = fs.readFileSync('client/src/components/UserManagement.jsx', 'utf8');

// Find the position of the ternary ' : ('
let p1 = code.indexOf(") : (");
let p2 = code.indexOf("handleDeleteUser(user.id", p1);

if (p1 > -1 && p2 > -1) {
  // Wrap the two buttons
  // The first button starts right after `) : (`
  code = code.replace(") : (", ") : (\\n                          <div className=\\\"flex items-center justify-end gap-2\\\">");
  
  // The end is `Ubah Sandi \\n </button> \\n )}`
  code = code.replace("Ubah Sandi\\n                          </button>\\n                        )}", "Ubah Sandi\\n                          </button>\\n                          </div>\\n                        )}");
  code = code.replace("Ubah Sandi\\r\\n                          </button>\\r\\n                        )}", "Ubah Sandi\\r\\n                          </button>\\r\\n                          </div>\\r\\n                        )}");

  fs.writeFileSync('client/src/components/UserManagement.jsx', code);
  console.log("Fixed wrapper via exact positional replace");
} else {
  console.log("Not found");
}
