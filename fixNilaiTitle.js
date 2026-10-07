const fs = require('fs');
let code = fs.readFileSync('client/src/pages/NilaiPage.jsx', 'utf8');

// 1. Add fetchUlanganList to imports
code = code.replace(
  "import { fetchNilai } from '../services/api';",
  "import { fetchNilai, fetchUlanganList } from '../services/api';"
);

// 2. Add ulanganList state
const stateTarget = `const [nilaiList, setNilaiList] = useState([]);
  const [loading, setLoading] = useState(true);`;
code = code.replace(stateTarget, `${stateTarget}\n  const [ulanganList, setUlanganList] = useState([]);`);

// 3. Fetch ulanganList inside useEffect
const useEffectTarget = `fetchNilai(currentUser.nama, activeKelas)
        .then((res) => {
          if (isMounted && res.success) {
            setNilaiList(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });`;

const newUseEffectTarget = `fetchNilai(currentUser.nama, activeKelas)
        .then((res) => {
          if (isMounted && res.success) {
            setNilaiList(res.data);
          }
        })
        .catch((err) => console.error(err));

      fetchUlanganList(activeKelas)
        .then((res) => {
          if (isMounted && res.success) {
            setUlanganList(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });`;

code = code.replace(useEffectTarget, newUseEffectTarget);
// Try CRLF fallback
if (!code.includes('fetchUlanganList(activeKelas)')) {
  code = code.replace(useEffectTarget.replace(/\n/g, '\r\n'), newUseEffectTarget);
}

// 4. Update UI to show Judul
const uiTarget = `<span className="font-bold text-slate-700 capitalize">{n.tipe === 'ulangan' ? 'Ulangan CBT' : n.tipe}</span>`;
const newUiTarget = `<span className="font-bold text-slate-700 capitalize">
                              {n.tipe === 'ulangan' ? (() => {
                                const u = ulanganList.find(ul => ul.id == n.ref_id);
                                return u ? \`CBT: \${u.judul}\` : 'Ulangan CBT';
                              })() : n.tipe}
                            </span>`;

code = code.replace(uiTarget, newUiTarget);

fs.writeFileSync('client/src/pages/NilaiPage.jsx', code);
console.log('NilaiPage fixed');
