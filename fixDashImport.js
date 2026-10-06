const fs = require('fs');
let code = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');

code = code.replace(
  "import { BookOpen, Calendar, UserCheck, Award, ArrowRight, Bell, Sparkles, Clock, CheckCircle2, Video } from 'lucide-react';",
  "import { BookOpen, Calendar, UserCheck, Award, ArrowRight, Bell, Sparkles, Clock, CheckCircle2, Video, FileText } from 'lucide-react';"
);

fs.writeFileSync('client/src/pages/Dashboard.jsx', code);
