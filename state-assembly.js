/* ===================================================================
   RAJNITI - STATE ASSEMBLY (VIDHAN SABHA) ELECTION
   Alag file: state-assembly.js   (assembly-data.js ke baad aur script.js ke baad load karo)
   Data approx hai (pichhle chunav ke vote share). Sab kuch SA_DATA mein badal sakte ho.
   =================================================================== */
(function () {
'use strict';

var SA_SAVE = 'rajniti_sa_save_v1';
var SA_HIST = 'rajniti_sa_hist_v1';

// bloc: nda / ind (INDIA) / ldf (Kerala left) / oth
var SA_DATA = {
 'Uttar Pradesh': { gov: 'BJP', parties: [['BJP',41.3,'nda'],['Samajwadi Party',32.1,'ind'],['BSP',12.9,'oth'],['Congress',2.3,'ind'],['RLD',2.9,'ind'],['Apna Dal (S)',1.6,'nda'],['Others',6.9,'oth']],
   leaders: { 'BJP':['Yogi Adityanath','Keshav Prasad Maurya','Brajesh Pathak'], 'Samajwadi Party':['Akhilesh Yadav','Shivpal Singh Yadav','Dimple Yadav'], 'BSP':['Mayawati','Akash Anand'], 'Congress':['Ajay Rai','Priyanka Gandhi Vadra'], 'RLD':['Jayant Chaudhary'], 'Apna Dal (S)':['Anupriya Patel'] } },
 'Maharashtra': { gov: 'BJP', parties: [['BJP',26.8,'nda'],['Shiv Sena',12.4,'nda'],['NCP (Ajit Pawar)',9.0,'nda'],['Congress',12.4,'ind'],['Shiv Sena (UBT)',9.9,'ind'],['NCP (SP)',11.3,'ind'],['Others',18.2,'oth']],
   leaders: { 'BJP':['Devendra Fadnavis','Chandrashekhar Bawankule'], 'Shiv Sena':['Eknath Shinde'], 'NCP (Ajit Pawar)':['Ajit Pawar','Praful Patel'], 'Congress':['Nana Patole','Prithviraj Chavan'], 'Shiv Sena (UBT)':['Uddhav Thackeray','Aaditya Thackeray'], 'NCP (SP)':['Sharad Pawar','Supriya Sule'] } },
 'Karnataka': { gov: 'Congress', parties: [['Congress',42.9,'ind'],['BJP',36.0,'nda'],['JD(S)',13.3,'oth'],['Others',7.8,'oth']],
   leaders: { 'Congress':['Siddaramaiah','D. K. Shivakumar'], 'BJP':['B. Y. Vijayendra','Basavaraj Bommai','R. Ashoka'], 'JD(S)':['H. D. Kumaraswamy','H. D. Deve Gowda'] } },
 'Andhra Pradesh': { gov: 'TDP', parties: [['TDP',39.0,'nda'],['YSRCP',39.4,'oth'],['Jana Sena',6.9,'nda'],['BJP',2.8,'nda'],['Congress',1.7,'ind'],['Others',10.2,'oth']],
   leaders: { 'TDP':['N. Chandrababu Naidu','Nara Lokesh'], 'YSRCP':['Y. S. Jagan Mohan Reddy'], 'Jana Sena':['Pawan Kalyan'], 'BJP':['Daggubati Purandeswari'], 'Congress':['Y. S. Sharmila'] } },
 'Madhya Pradesh': { gov: 'BJP', parties: [['BJP',48.6,'nda'],['Congress',40.4,'ind'],['BSP',3.4,'oth'],['Others',7.6,'oth']],
   leaders: { 'BJP':['Mohan Yadav','Shivraj Singh Chouhan','Kailash Vijayvargiya'], 'Congress':['Kamal Nath','Jitu Patwari','Digvijaya Singh','Umang Singhar'] } },
 'Odisha': { gov: 'BJP', parties: [['BJP',40.1,'nda'],['BJD',40.2,'oth'],['Congress',13.3,'ind'],['Others',6.4,'oth']],
   leaders: { 'BJP':['Mohan Charan Majhi','Manmohan Samal'], 'BJD':['Naveen Patnaik','V. K. Pandian'], 'Congress':['Sarat Pattanayak','Bhakta Das'] } },
 'Kerala': { gov: 'CPI(M)', parties: [['CPI(M)',25.4,'ldf'],['CPI',8.0,'ldf'],['Kerala Congress (M)',3.0,'ldf'],['Congress',25.1,'ind'],['IUML',8.0,'ind'],['BJP',12.4,'nda'],['Others',18.1,'oth']],
   leaders: { 'CPI(M)':['Pinarayi Vijayan','M. V. Govindan'], 'Congress':['V. D. Satheesan','Ramesh Chennithala','K. Sudhakaran'], 'IUML':['Sadiq Ali Thangal','P. K. Kunhalikutty'], 'BJP':['K. Surendran','Rajeev Chandrasekhar'], 'CPI':['Binoy Viswam'] } },
 'Assam': { gov: 'BJP', parties: [['BJP',33.2,'nda'],['AGP',7.9,'nda'],['UPPL',3.0,'nda'],['Congress',29.7,'ind'],['AIUDF',9.3,'ind'],['Others',16.9,'oth']],
   leaders: { 'BJP':['Himanta Biswa Sarma','Dilip Saikia'], 'Congress':['Gaurav Gogoi','Bhupen Kumar Borah'], 'AIUDF':['Badruddin Ajmal'], 'AGP':['Atul Bora'], 'UPPL':['Pramod Boro'] } },
 'Punjab': { gov: 'AAP', parties: [['AAP',42.0,'oth'],['Congress',23.1,'ind'],['SAD',18.4,'oth'],['BJP',6.6,'nda'],['Others',9.9,'oth']],
   leaders: { 'AAP':['Bhagwant Mann','Arvind Kejriwal'], 'Congress':['Amarinder Singh Raja Warring','Partap Singh Bajwa'], 'SAD':['Sukhbir Singh Badal','Harsimrat Kaur Badal'], 'BJP':['Sunil Jakhar'] } },
 'Jharkhand': { gov: 'JMM', parties: [['JMM',23.4,'ind'],['BJP',33.2,'nda'],['Congress',15.6,'ind'],['RJD',3.4,'ind'],['AJSU',3.8,'nda'],['JD(U)',1.0,'nda'],['Others',19.6,'oth']],
   leaders: { 'JMM':['Hemant Soren','Kalpana Soren'], 'BJP':['Babulal Marandi','Champai Soren'], 'Congress':['Keshav Mahto Kamlesh','Rajesh Thakur'], 'RJD':['Tejashwi Yadav'], 'AJSU':['Sudesh Mahto'] } },
 'Chhattisgarh': { gov: 'BJP', parties: [['BJP',46.3,'nda'],['Congress',42.2,'ind'],['Others',11.5,'oth']],
   leaders: { 'BJP':['Vishnu Deo Sai','Raman Singh','Arun Sao'], 'Congress':['Bhupesh Baghel','T. S. Singh Deo','Charandas Mahant'] } },
 'Haryana': { gov: 'BJP', parties: [['BJP',39.9,'nda'],['Congress',39.1,'ind'],['INLD',4.1,'oth'],['AAP',1.8,'oth'],['JJP',0.9,'oth'],['Others',14.2,'oth']],
   leaders: { 'BJP':['Nayab Singh Saini','Manohar Lal Khattar'], 'Congress':['Bhupinder Singh Hooda','Kumari Selja'], 'INLD':['Abhay Singh Chautala'], 'JJP':['Dushyant Chautala'], 'AAP':['Sunita Kejriwal'] } },
 'Jammu & Kashmir': { gov: 'National Conference', parties: [['National Conference',23.4,'ind'],['BJP',25.6,'nda'],['Congress',11.9,'ind'],['PDP',8.9,'oth'],['Others',30.2,'oth']],
   leaders: { 'National Conference':['Omar Abdullah','Farooq Abdullah'], 'BJP':['Ravinder Raina','Sat Sharma'], 'Congress':['Tariq Hameed Karra','Ghulam Ahmad Mir'], 'PDP':['Mehbooba Mufti','Iltija Mufti'] } },
 'Delhi': { gov: 'BJP', parties: [['BJP',45.6,'nda'],['AAP',43.6,'oth'],['Congress',6.4,'ind'],['Others',4.4,'oth']],
   leaders: { 'BJP':['Rekha Gupta','Parvesh Verma','Virendra Sachdeva'], 'AAP':['Atishi','Arvind Kejriwal','Manish Sisodia'], 'Congress':['Devender Yadav','Sandeep Dikshit'] } },
 'Goa': { gov: 'BJP', parties: [['BJP',33.3,'nda'],['Congress',23.5,'ind'],['AAP',6.8,'oth'],['MGP',7.6,'nda'],['Others',28.8,'oth']],
   leaders: { 'BJP':['Pramod Sawant','Vishwajit Rane'], 'Congress':['Amit Patkar','Yuri Alemao'], 'AAP':['Amit Palekar'], 'MGP':['Sudin Dhavalikar'] } },
 'Manipur': { gov: 'BJP', parties: [['BJP',37.8,'nda'],['Congress',16.8,'ind'],['NPP',17.0,'nda'],['NPF',8.9,'nda'],['JD(U)',10.8,'nda'],['Others',8.7,'oth']],
   leaders: { 'BJP':['N. Biren Singh','Thokchom Radheshyam'], 'Congress':['Okram Ibobi Singh','Keisham Meghachandra'], 'NPP':['Y. Joykumar Singh'], 'NPF':['Awangbou Newmai'] } },
 'Meghalaya': { gov: 'NPP', parties: [['NPP',31.5,'nda'],['Congress',13.9,'ind'],['TMC',13.8,'ind'],['UDP',11.6,'oth'],['BJP',9.3,'nda'],['VPP',8.0,'oth'],['Others',11.9,'oth']],
   leaders: { 'NPP':['Conrad K. Sangma','Prestone Tynsong'], 'Congress':['Vincent H. Pala'], 'TMC':['Mukul Sangma'], 'UDP':['Metbah Lyngdoh'], 'BJP':['Ernest Mawrie'], 'VPP':['Ardent Miller Basaiawmoit'] } },
 'Mizoram': { gov: 'ZPM', parties: [['ZPM',37.9,'oth'],['MNF',35.1,'nda'],['Congress',20.8,'ind'],['BJP',5.1,'nda'],['Others',1.1,'oth']],
   leaders: { 'ZPM':['Lalduhoma'], 'MNF':['Zoramthanga','Lalsawta'], 'Congress':['Lalsawta Hrahsel'], 'BJP':['Vanlalhmuaka'] } },
 'Nagaland': { gov: 'NDPP', parties: [['NDPP',25.8,'nda'],['BJP',18.8,'nda'],['NPF',11.9,'oth'],['NCP',11.8,'oth'],['Congress',3.8,'ind'],['Others',27.9,'oth']],
   leaders: { 'NDPP':['Neiphiu Rio','T. R. Zeliang'], 'BJP':['Temjen Imna Along','Metsubo Jamir'], 'NPF':['Shurhozelie Liezietsu'], 'NCP':['Chumben Murry'] } },
 'Arunachal Pradesh': { gov: 'BJP', parties: [['BJP',54.6,'nda'],['NPP',14.2,'nda'],['NCP',8.2,'oth'],['Congress',5.6,'ind'],['Others',17.4,'oth']],
   leaders: { 'BJP':['Pema Khandu','Chowna Mein'], 'NPP':['Tesam Pongte'], 'Congress':['Nabam Tuki','Bosiram Siram'] } },
 // neeche ki states ki map file aate hi apne aap chalu ho jayengi
 'Uttarakhand': { gov: 'BJP', parties: [['BJP',44.3,'nda'],['Congress',37.9,'ind'],['BSP',4.8,'oth'],['Others',13.0,'oth']], leaders: { 'BJP':['Pushkar Singh Dhami','Ajay Bhatt'], 'Congress':['Harish Rawat','Karan Mahara','Ganesh Godiyal'] } },
 'Bihar': { gov: 'JD(U)', parties: [['BJP',20.1,'nda'],['JD(U)',19.3,'nda'],['LJP (RV)',5.0,'nda'],['HAM',1.0,'nda'],['RJD',23.0,'ind'],['Congress',8.7,'ind'],['CPI(ML)L',3.0,'ind'],['AIMIM',1.9,'oth'],['Others',18.0,'oth']], leaders: { 'BJP':['Samrat Choudhary','Vijay Kumar Sinha'], 'JD(U)':['Nitish Kumar','Lalan Singh'], 'RJD':['Tejashwi Yadav','Lalu Prasad Yadav'], 'Congress':['Rajesh Ram','Shakeel Ahmad Khan'], 'LJP (RV)':['Chirag Paswan'] } },
 'Gujarat': { gov: 'BJP', parties: [['BJP',52.5,'nda'],['Congress',27.3,'ind'],['AAP',12.9,'oth'],['Others',7.3,'oth']], leaders: { 'BJP':['Bhupendra Patel','C. R. Patil'], 'Congress':['Shaktisinh Gohil','Amit Chavda'], 'AAP':['Isudan Gadhvi','Gopal Italia'] } },
 'Rajasthan': { gov: 'BJP', parties: [['BJP',41.7,'nda'],['Congress',39.5,'ind'],['Others',18.8,'oth']], leaders: { 'BJP':['Bhajan Lal Sharma','Vasundhara Raje'], 'Congress':['Ashok Gehlot','Sachin Pilot','Govind Singh Dotasra'] } },
 'Telangana': { gov: 'Congress', parties: [['Congress',39.4,'ind'],['BRS',37.4,'oth'],['BJP',13.9,'nda'],['AIMIM',2.2,'oth'],['Others',7.1,'oth']], leaders: { 'Congress':['A. Revanth Reddy','Mallu Bhatti Vikramarka'], 'BRS':['K. Chandrashekar Rao','K. T. Rama Rao'], 'BJP':['G. Kishan Reddy','Bandi Sanjay Kumar'], 'AIMIM':['Asaduddin Owaisi'] } },
 'Tamil Nadu': { gov: 'DMK', parties: [['DMK',37.7,'ind'],['AIADMK',33.3,'nda'],['Congress',4.3,'ind'],['BJP',2.6,'nda'],['PMK',3.8,'nda'],['Others',18.3,'oth']], leaders: { 'DMK':['M. K. Stalin','Udhayanidhi Stalin'], 'AIADMK':['Edappadi K. Palaniswami'], 'BJP':['K. Annamalai'], 'Congress':['K. Selvaperunthagai'] } },
 'West Bengal': { gov: 'TMC', parties: [['TMC',48.0,'ind'],['BJP',38.1,'nda'],['Congress',3.0,'ind'],['CPI(M)',4.7,'ldf'],['Others',6.2,'oth']], leaders: { 'TMC':['Mamata Banerjee','Abhishek Banerjee'], 'BJP':['Suvendu Adhikari','Sukanta Majumdar'], 'CPI(M)':['Mohammed Salim'], 'Congress':['Adhir Ranjan Chowdhury'] } },
 'Himachal Pradesh': { gov: 'Congress', parties: [['Congress',43.9,'ind'],['BJP',43.0,'nda'],['Others',13.1,'oth']], leaders: { 'Congress':['Sukhvinder Singh Sukhu','Mukesh Agnihotri'], 'BJP':['Jai Ram Thakur','Jagat Prakash Nadda'] } },
 'Tripura': { gov: 'BJP', parties: [['BJP',39.0,'nda'],['Tipra Motha',19.7,'oth'],['CPI(M)',24.6,'ldf'],['Congress',8.6,'ind'],['Others',8.1,'oth']], leaders: { 'BJP':['Manik Saha','Biplab Kumar Deb'], 'Tipra Motha':['Pradyot Debbarma'], 'CPI(M)':['Jitendra Chaudhury'] } },
 'Sikkim': { gov: 'SKM', parties: [['SKM',58.4,'nda'],['SDF',27.3,'oth'],['Others',14.3,'oth']], leaders: { 'SKM':['Prem Singh Tamang'], 'SDF':['Pawan Kumar Chamling'] } },
 'Puducherry': { gov: 'AINRC', parties: [['AINRC',25.0,'nda'],['DMK',28.3,'ind'],['BJP',13.6,'nda'],['Congress',17.0,'ind'],['Others',16.1,'oth']], leaders: { 'AINRC':['N. Rangasamy'], 'DMK':['R. Siva'], 'BJP':['A. Namassivayam'], 'Congress':['V. Vaithilingam'] } }
};

// kisi state ki zones (division). [naam, lonMin, lonMax, latMin, latMax] - pehla match jeetta hai.
var B = 999;
var SA_ZONES = {
 'Uttar Pradesh': [['Bundelkhand',77,81.4,23,26.2],['Purvanchal',82.4,B,23,B],['Rohilkhand',78.4,80.4,27.6,29.8],['Paschim UP',0,79.2,27.3,B],['Braj-Doab',0,80.3,25,B],['Awadh',0,B,0,B]],
 'Maharashtra': [['Vidarbha',78,B,0,B],['Konkan',0,73.7,0,B],['North Maharashtra',0,76.3,19.8,B],['Marathwada',75.5,B,17.8,B],['Western Maharashtra',0,B,0,B]],
 'Madhya Pradesh': [['Gwalior-Chambal',0,79.2,25,B],['Bundelkhand',78.3,80.7,23.9,25.2],['Vindhya',80.7,B,23.4,B],['Malwa-Nimar',0,76.9,0,B],['Bhopal-Narmadapuram',0,78.6,0,B],['Mahakaushal',0,B,0,B]],
 'Karnataka': [['Bengaluru',77.35,77.9,12.7,13.3],['Coastal Karnataka',0,75.3,0,14.9],['Kalyana Karnataka',76,B,15.1,B],['Kittur Karnataka',0,76,14.4,B],['Central Karnataka',0,B,13.3,15.1],['Old Mysuru',0,B,0,B]],
 'Andhra Pradesh': [['Uttarandhra',0,B,17.3,B],['Rayalaseema',0,79.3,0,16],['Coastal Andhra',0,B,0,B]],
 'Odisha': [['Western Odisha',0,84.5,0,B],['Southern Odisha',0,B,0,19.6],['Northern Odisha',0,B,21.4,B],['Coastal Odisha',0,B,0,B]],
 'Kerala': [['Malabar',0,B,10.4,B],['Central Kerala',0,B,9.3,10.4],['Travancore',0,B,0,B]],
 'Assam': [['Barak Valley',0,93.2,0,24.95],['Karbi-Dima Hasao',92.5,93.9,25,26.1],['Lower Assam',0,91.3,0,B],['Upper Assam',93.2,B,0,B],['Central Assam',0,B,0,B]],
 'Punjab': [['Majha',74,75.35,31.2,B],['Doaba',75.3,76.3,30.9,31.9],['Malwa',0,B,0,B]],
 'Jharkhand': [['Palamu',0,84.3,0,B],['Santhal Pargana',86.6,B,0,B],['Kolhan',85.5,B,0,23.1],['South Chotanagpur',0,B,0,23.6],['North Chotanagpur',0,B,0,B]],
 'Chhattisgarh': [['Bastar',0,B,0,20.8],['Surguja',0,B,22.6,B],['Chhattisgarh Plains',0,B,0,B]],
 'Haryana': [['Ahirwal',0,B,0,28.3],['Bagar-Sirsa',0,75.9,0,B],['Ambala-Kurukshetra',0,B,29.7,B],['NCR-Sonipat',76.6,B,0,29.1],['Central Haryana',0,B,0,B]],
 'Jammu & Kashmir': [['Ladakh',76,B,33,B],['Kashmir Valley',74.2,B,33.4,B],['Jammu Division',0,B,0,B]],
 'Delhi': [['North Delhi',0,B,28.7,B],['East Delhi',77.25,B,0,B],['South Delhi',0,77.25,0,28.55],['West & Central Delhi',0,B,0,B]],
 'Goa': [['North Goa',0,B,15.4,B],['South Goa',0,B,0,B]],
 'Manipur': [['Imphal Valley',93.7,94.25,24.5,25.1],['Hill Districts',0,B,0,B]],
 'Meghalaya': [['Garo Hills',0,91,0,B],['Khasi Hills',0,92.3,0,B],['Jaintia Hills',0,B,0,B]],
 'Mizoram': [['North Mizoram',0,B,23.6,B],['Central Mizoram',0,B,22.9,B],['South Mizoram',0,B,0,B]],
 'Nagaland': [['Eastern Nagaland',94.8,B,0,B],['Central Nagaland',94,B,0,B],['Western Nagaland',0,B,0,B]],
 'Arunachal Pradesh': [['Eastern Arunachal',95.5,B,0,B],['Central Arunachal',93.5,B,0,B],['Western Arunachal',0,B,0,B]],
 'Uttarakhand': [['Garhwal',0,79.2,0,B],['Kumaon',0,B,0,B]]
};

var SA_COL = { 'BJP':'#f97316','Congress':'#19aaed','Samajwadi Party':'#dc2626','BSP':'#2563eb','RLD':'#84cc16','Apna Dal (S)':'#f59e0b','Shiv Sena':'#fb923c','Shiv Sena (UBT)':'#ea580c','NCP (Ajit Pawar)':'#0ea5e9','NCP (SP)':'#38bdf8','JD(S)':'#4ade80','TDP':'#facc15','YSRCP':'#3b82f6','Jana Sena':'#ef4444','BJD':'#16a34a','CPI(M)':'#b91c1c','CPI':'#ef4444','Kerala Congress (M)':'#a3e635','IUML':'#65a30d','AGP':'#0891b2','UPPL':'#8b5cf6','AIUDF':'#0d9488','AAP':'#06b6d4','SAD':'#1d4ed8','JMM':'#16a34a','RJD':'#15803d','AJSU':'#a16207','JD(U)':'#059669','INLD':'#22c55e','JJP':'#eab308','National Conference':'#dc2626','PDP':'#10b981','MGP':'#f59e0b','NPP':'#7c3aed','NPF':'#0369a1','NDPP':'#be185d','NCP':'#0ea5e9','TMC':'#16a34a','UDP':'#2563eb','VPP':'#0d9488','ZPM':'#06b6d4','MNF':'#2563eb','LJP (RV)':'#a855f7','HAM':'#14b8a6','CPI(ML)L':'#be123c','AIMIM':'#15803d','BRS':'#ec4899','DMK':'#ef4444','AIADMK':'#15803d','PMK':'#facc15','Tipra Motha':'#c084fc','SKM':'#f59e0b','SDF':'#22d3ee','AINRC':'#3b82f6','Others':'#94a3b8' };
function colOf(p) {
    if (SA_COL[p]) return SA_COL[p];
    var h = 0; for (var i = 0; i < p.length; i++) h = (h * 31 + p.charCodeAt(i)) % 360;
    return 'hsl(' + h + ',55%,52%)';
}
var BLOC_NAME = { nda: 'NDA', ind: 'INDIA', ldf: 'LDF', oth: 'Anya' };

// ---------- utils ----------
function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function srand(seed) { var h = hash(seed); h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }
function rnd(a, b) { return a + Math.random() * (b - a); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function E(s) { return (typeof esc === 'function') ? esc(s) : String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
function Q(s) { return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;'); }
function fmt(n) { return Math.round(n).toLocaleString('en-IN'); }
function nameGen() { return (typeof randName === 'function') ? randName() : 'Shri ' + pick(['Rakesh','Mahesh','Suresh','Anil','Vinod','Dinesh','Pradeep','Sanjay']) + ' ' + pick(['Sharma','Verma','Yadav','Singh','Patel','Reddy','Nair','Das']); }

window.__SA = { SA_DATA: SA_DATA, SA_ZONES: SA_ZONES, hash: hash, srand: srand, colOf: colOf };

// =============================================================
//  STATE LOAD, DIVISIONS, PHASES, MODEL
// =============================================================
var ST = null;      // abhi chuni hui state ka saaf data
var G = null;       // chalta hua game

function availableStates() {
    return (typeof assemblyData !== 'undefined') ? Object.keys(assemblyData) : [];
}
function dist2(a, b) { return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]); }

function assignDivisions(name, seats) {
    var zones = SA_ZONES[name], div = {};
    if (zones) {
        seats.forEach(function (s) {
            var z = null;
            for (var i = 0; i < zones.length; i++) {
                var r = zones[i];
                if (s.c[0] >= r[1] && s.c[0] <= r[2] && s.c[1] >= r[3] && s.c[1] <= r[4]) { z = r[0]; break; }
            }
            div[s.no] = z || zones[zones.length - 1][0];
        });
    } else {   // tertile grid
        var lons = seats.map(function (s) { return s.c[0]; }).sort(function (a, b) { return a - b; });
        var lats = seats.map(function (s) { return s.c[1]; }).sort(function (a, b) { return a - b; });
        var l1 = lons[Math.floor(lons.length / 3)], l2 = lons[Math.floor(lons.length * 2 / 3)];
        var a1 = lats[Math.floor(lats.length / 3)], a2 = lats[Math.floor(lats.length * 2 / 3)];
        seats.forEach(function (s) {
            var ns = s.c[1] >= a2 ? 'Uttari' : (s.c[1] >= a1 ? 'Madhya' : 'Dakshini');
            var ew = s.c[0] <= l1 ? 'Paschimi' : (s.c[0] <= l2 ? 'Kendriya' : 'Poorvi');
            div[s.no] = ns + ' ' + ew;
        });
    }
    // chhoti zones ko paas ki badi zone mein milao
    for (var pass = 0; pass < 4; pass++) {
        var cnt = {}, sum = {};
        seats.forEach(function (s) { var d = div[s.no]; cnt[d] = (cnt[d] || 0) + 1; sum[d] = sum[d] || [0, 0]; sum[d][0] += s.c[0]; sum[d][1] += s.c[1]; });
        var names = Object.keys(cnt), small = names.filter(function (n) { return cnt[n] < 3; });
        if (!small.length || names.length < 2) break;
        small.forEach(function (sn) {
            var cs = [sum[sn][0] / cnt[sn], sum[sn][1] / cnt[sn]], best = null, bd = 1e9;
            names.forEach(function (n) { if (n !== sn && cnt[n] >= 3) { var d = dist2(cs, [sum[n][0] / cnt[n], sum[n][1] / cnt[n]]); if (d < bd) { bd = d; best = n; } } });
            if (best) seats.forEach(function (s) { if (div[s.no] === sn) div[s.no] = best; });
        });
    }
    return div;
}

function loadState(name) {
    var fc = (typeof assemblyData !== 'undefined') ? assemblyData[name] : null;
    var data = SA_DATA[name];
    if (!fc || !data) return null;
    var seats = fc.features.map(function (f) {
        var p = f.properties;
        return { no: p.no, nm: p.nm, d: p.d, pc: p.pc, t: p.t, c: p.c, f: f };
    }).sort(function (a, b) { return a.no - b.no; });
    var div = assignDivisions(name, seats);
    var dc = {}, dl = {};
    seats.forEach(function (s) { s.div = div[s.no]; dc[s.div] = (dc[s.div] || 0) + 1; dl[s.div] = dl[s.div] || [0, 0, 0]; dl[s.div][0] += s.c[0]; dl[s.div][1] += s.c[1]; dl[s.div][2]++; });
    var divs = Object.keys(dc).sort(function (a, b) { return dl[a][0] / dl[a][2] - dl[b][0] / dl[b][2]; });
    var n = seats.length, nPh = clamp(Math.ceil(n / 70), 1, 7);
    var order = seats.slice().sort(function (a, b) { var da = divs.indexOf(a.div), db = divs.indexOf(b.div); return da !== db ? da - db : a.no - b.no; });
    var phases = [], per = Math.ceil(n / nPh);
    for (var i = 0; i < nPh; i++) phases.push(order.slice(i * per, (i + 1) * per).map(function (s) { return s.no; }));
    phases = phases.filter(function (p) { return p.length; });
    var byNo = {}; seats.forEach(function (s) { byNo[s.no] = s; });
    var parties = data.parties.map(function (p) { return { n: p[0], s: p[1], b: p[2] }; });
    // Career Mode ki apni party ko is state ke chunav mein jodo
    if (window.CareerMode && CareerMode.hasParty() && (CareerMode.inState(name) || SA.forceCareer === name) && !parties.some(function (x) { return x.n === CareerMode.getParty().name; })) {
        var cp = CareerMode.getParty(), sh = Math.round(CareerMode.partyShare() * 10) / 10, oth = parties.filter(function (x) { return x.n === 'Others'; })[0];
        parties.push({ n: cp.name, s: sh, b: 'oth' });
        if (oth) oth.s = Math.max(0.5, oth.s - sh);
        SA_COL[cp.name] = cp.color;
        data.leaders[cp.name] = CareerMode.leaders();
    }
    return { name: name, data: data, seats: seats, byNo: byNo, divs: divs, divCount: dc, phases: phases, n: n, maj: Math.floor(n / 2) + 1, parties: parties };
}

function leadersOf(party) {
    var l = ST.data.leaders[party];
    if (l && l.length) return l.slice();
    return [party + ' ke pradesh adhyaksh', party + ' ke vidhayak dal neta'];
}
function partyShare(p) { var x = ST.parties.filter(function (q) { return q.n === p; })[0]; return x ? x.s : 0; }
function partyBloc(p) { var x = ST.parties.filter(function (q) { return q.n === p; })[0]; return x ? x.b : 'oth'; }

// ---------- seat par vote share ka base ----------
var BASE = {};
function ls24Map(no) {
    var L = window.LS24 && LS24.ac; if (!L) return null;
    var nm = ST.name, a = L[nm] || L[nm.replace(' and ', ' & ')] || L[nm.replace(' & ', ' and ')];
    var r = a && a[no]; if (!r || !r[3]) return null;
    var m = {}, tot = 0; r[3].forEach(function (c) { m[c[1]] = (m[c[1]] || 0) + c[2]; tot += c[2]; });
    if (!tot) return null; Object.keys(m).forEach(function (k) { m[k] /= tot; }); return m;
}
function seatBase(no) {
    if (BASE[no]) return BASE[no];
    var s = ST.byNo[no], out = {}, tot = 0;
    ST.parties.forEach(function (p) {
        var v = p.s * (1 + (srand(ST.name + '|d|' + s.div + '|' + p.n) - 0.5) * 0.8) * (1 + (srand(ST.name + '|s|' + no + '|' + p.n) - 0.5) * 0.9);
        out[p.n] = v; tot += v;
    });
    Object.keys(out).forEach(function (k) { out[k] /= tot; });
    // pakad: asli Lok Sabha 2024 ke is vidhan-khand ke vote (ECI) se milaya jata hai
    var ls = ls24Map(no);
    if (ls) {
        var known = {}; ST.parties.forEach(function (p) { known[p.n] = 1; });
        var oth = 0; Object.keys(ls).forEach(function (k) { if (!known[k]) oth += ls[k]; });
        var mix = {}, t2 = 0;
        ST.parties.forEach(function (p) { var l = p.n === 'Others' ? oth : (ls[p.n] || 0); mix[p.n] = 0.4 * out[p.n] + 0.6 * l; t2 += mix[p.n]; });
        if (t2 > 0) Object.keys(mix).forEach(function (k) { out[k] = mix[k] / t2; });
    }
    BASE[no] = out;
    return out;
}

// ---------- seat sharing (auto) ----------
function autoAlloc(camp, main, quotas) {
    var alloc = {}, left = {}, nos = ST.seats.map(function (s) { return s.no; });
    if (camp.length <= 1) { nos.forEach(function (no) { alloc[no] = main; }); return alloc; }
    var mean = {};
    camp.forEach(function (p) { var t = 0; nos.forEach(function (no) { t += seatBase(no)[p] || 0; }); mean[p] = t / nos.length || 1e-6; });
    var q = {}, used = 0;
    camp.forEach(function (p) { if (p !== main) { q[p] = quotas && quotas[p] != null ? quotas[p] : 0; used += q[p]; } });
    q[main] = Math.max(0, nos.length - used);
    camp.forEach(function (p) { left[p] = q[p]; });
    var pairs = [];
    nos.forEach(function (no) { camp.forEach(function (p) { pairs.push([no, p, (seatBase(no)[p] || 0) / mean[p]]); }); });
    pairs.sort(function (a, b) { return b[2] - a[2]; });
    pairs.forEach(function (x) { if (alloc[x[0]] == null && left[x[1]] > 0) { alloc[x[0]] = x[1]; left[x[1]]--; } });
    nos.forEach(function (no) { if (alloc[no] == null) alloc[no] = main; });
    return alloc;
}
function defaultQuotas(camp, main) {
    var q = {}, tot = 0;
    camp.forEach(function (p) { tot += partyShare(p); });
    camp.forEach(function (p) { if (p !== main) q[p] = Math.max(1, Math.round(ST.n * partyShare(p) / tot * 0.9)); });
    return q;
}

// ---------- modifiers ----------
function newMod() { return { guru: {}, kar: {}, karDiv: {}, off: {}, rallyS: {}, rallyD: {}, poach: {}, st: {}, cut: {}, man: 0, medD: {}, medS: {}, rdn: {}, mdn: {}, vip: {} }; }
function phaseOfSeat(no) { for (var i = 0; i < ST.phases.length; i++) if (ST.phases[i].indexOf(no) >= 0) return i; return 0; }
function stMod(m, ph) { if (!m.st[ph]) m.st[ph] = { rally: 0, it: 0, media: 0 }; return m.st[ph]; }
var MAXGAIN = 0.85, MAXCUT = 0.6;
function gainOf(side, no) {
    var m = G.mod[side], s = ST.byNo[no], ph = phaseOfSeat(no), sm = m.st[ph] || { rally: 0, it: 0, media: 0 };
    var parts = [m.guru[no], m.kar[no], m.karDiv[s.div], m.off[no], m.rallyS[no], m.rallyD[s.div], m.poach[no], sm.rally, sm.it, sm.media, m.man, (m.medD || {})[s.div], (m.medS || {})[no], (m.vip || {})[no]];
    var keep = 1;
    parts.forEach(function (p) { if (p > 0) keep *= (1 - p); });
    return Math.min(MAXGAIN, 1 - keep);
}
function cutOf(side, no) { var c = G.mod[side].cut[phaseOfSeat(no)] || 0; return Math.min(MAXCUT, c); }

function entityList(no, noise) {
    var b = seatBase(no), you = G.you, opp = G.opp;
    var cy = G.alloc.you[no] || you.main, co = G.alloc.opp[no] || opp.main;
    var ent = [], sy = 0, so = 0;
    you.camp.forEach(function (p) { sy += (b[p] || 0) * (p === cy ? 1 : 0.85); });
    opp.camp.forEach(function (p) { so += (b[p] || 0) * (p === co ? 1 : 0.8); });
    var inc = G.incumbent;
    if (inc && you.camp.indexOf(inc) >= 0) sy *= 0.96;
    if (inc && opp.camp.indexOf(inc) >= 0) so *= 0.96;
    sy *= 1 + clamp(G.hawa.you, -30, 30) * 0.006;
    so *= 1 + clamp(G.hawa.opp, -30, 30) * 0.006;
    ent.push({ id: 'you', party: cy, v: sy });
    ent.push({ id: 'opp', party: co, v: so });
    ST.parties.forEach(function (p) {
        if (you.camp.indexOf(p.n) >= 0 || opp.camp.indexOf(p.n) >= 0) return;
        ent.push({ id: 'p:' + p.n, party: p.n, v: (b[p.n] || 0) * (p.n === 'Others' ? 0.55 : 0.95) });
    });
    if (G.dq && G.dq[no]) ent.forEach(function (e) { if (e.id === G.dq[no]) e.v = 0; });
    ent.forEach(function (e) { if (noise) e.v *= rnd(0.9, 1.1); });
    var tot = ent.reduce(function (a, e) { return a + e.v; }, 0) || 1;
    ent.forEach(function (e) { e.s = e.v / tot; });
    ['you', 'opp'].forEach(function (side) {
        var me = ent.filter(function (e) { return e.id === side; })[0], g = gainOf(side, no);
        if (g > 0) {
            var others = ent.filter(function (e) { return e !== me; }), pool = others.reduce(function (a, e) { return a + e.s; }, 0), take = Math.min(g, pool);
            if (pool > 0) others.forEach(function (e) { e.s -= take * e.s / pool; });
            me.s += take;
        }
    });
    ['you', 'opp'].forEach(function (side) {
        var me = ent.filter(function (e) { return e.id === side; })[0], c = cutOf(side, no);
        if (c > 0) {
            var take = Math.min(c, me.s), others = ent.filter(function (e) { return e !== me; }), pool = others.reduce(function (a, e) { return a + e.s; }, 0);
            me.s -= take;
            if (pool > 0) others.forEach(function (e) { e.s += take * e.s / pool; });
        }
    });
    ent.sort(function (a, b) { return b.s - a.s; });
    return ent;
}
// Rujhan (kaun aage) tabhi dikhta hai jab pehla round khatam ho ya Survey karwaya ho. Game shuru mein map saaf rehta hai.
function revealed() { return !!(G && (G.reveal || G.round > 1)); }
function leadOf(no) {
    var e = entityList(no, false);
    return { id: e[0].id, party: e[0].party, share: e[0].s, margin: e[0].s - e[1].s, list: e };
}
function decideSeat(no) {
    var e = entityList(no, true);
    var sh = {}; e.forEach(function (x) { sh[x.id] = x.s; });
    G.done[no] = { id: e[0].id, party: e[0].party, margin: Math.round((e[0].s - e[1].s) * 1000) / 10, share: Math.round(e[0].s * 1000) / 10, ru: e[1].party, ruId: e[1].id };
}
function campOfId(id) { return id === 'you' ? 'you' : (id === 'opp' ? 'opp' : 'oth'); }
function tallyDone() {
    var t = { you: 0, opp: 0, oth: 0, byParty: {} };
    Object.keys(G.done).forEach(function (no) {
        var d = G.done[no]; t[campOfId(d.id)]++;
        t.byParty[d.party] = (t.byParty[d.party] || 0) + 1;
    });
    return t;
}
function tallyLive(ph) {
    var t = { you: 0, opp: 0, oth: 0 };
    if (ph === G.phase && !revealed()) return t;
    ST.phases[ph].forEach(function (no) { t[campOfId(leadOf(no).id)]++; });
    return t;
}

// ---------- paisa aur phase ----------
function phaseFund(ph) { return 125; }
var ROUND_BONUS = 25, ROUNDS = 3;
function phaseSeatsOfDiv(div) { return ST.phases[G.phase].filter(function (no) { return ST.byNo[no].div === div; }); }
function phaseDivs() { var s = {}; ST.phases[G.phase].forEach(function (no) { s[ST.byNo[no].div] = 1; }); return ST.divs.filter(function (d) { return s[d]; }); }
function newCnt() { return { contro: { you: 0, opp: 0 }, donor: 0, black: 0, crowd: 0, it: 0, media: 0, rallyState: 0, rest: 0, team: 0, court: { you: 0, opp: 0 }, spy: { you: 0, opp: 0 }, mcc: { you: 0, opp: 0 }, karDivN: { you: 0, opp: 0 } }; }

function newsPush(t) { G.news.unshift(t); G.news = G.news.slice(0, 12); }
function addHawa(side, v) { /* hawa meter hata diya gaya */ }
function addBudget(side, v) { if (side === 'you') G.budget += v; else G.ai.budget += v; }
function addStamina(side, v) { if (side === 'you') G.stamina = clamp(G.stamina + v, 0, 100); else G.ai.stamina = clamp((G.ai.stamina == null ? 100 : G.ai.stamina) + v, 0, 100); }
function fixG() {
    if (!G) return;
    ['manDoneO', 'donors', 'dq'].forEach(function (k) { if (!G[k]) G[k] = {}; });
    if (!G.deps) G.deps = [];
    if (!G.loan) G.loan = { you: null, opp: null };
    if (!G.viol) G.viol = { you: 0, opp: 0 };
    if (!G.evid) G.evid = { you: 0, opp: 0 };
    if (!G.defence) G.defence = { you: null, opp: null };
    if (!G.vips) G.vips = { you: {}, opp: {} };
    if (G.risk == null) G.risk = 0;
    var d = newCnt(); Object.keys(d).forEach(function (k) { if (G.cnt[k] == null) G.cnt[k] = d[k]; });
    ['you', 'opp'].forEach(function (sd) { var m = G.mod[sd], n = newMod(); Object.keys(n).forEach(function (k) { if (m[k] == null) m[k] = n[k]; }); });
}

// =============================================================
//  GAME CREATE / ACTIONS / AI / FLOW
// =============================================================
var DIFF = {
    Easy: { n: 1, name: 'Aasaan', spend: 0.55, smart: 0.3, risky: 0, bonus: -15 },
    Normal: { n: 3, name: 'Normal', spend: 0.9, smart: 0.6, risky: 0.12, bonus: 0 },
    Hard: { n: 5, name: 'Mushkil', spend: 1.2, smart: 0.85, risky: 0.3, bonus: 30 },
    Brutal: { n: 7, name: 'Bahut Mushkil', spend: 1.5, smart: 1, risky: 0.45, bonus: 60 }
};
function dcfg() { return DIFF[G && G.diff] || DIFF.Normal; }
var CONTRO = [
    { id: 'ghotala', name: 'Ghotale ka khulasa', cost: 30, p: 0.55, hawa: 4 },
    { id: 'bayan', name: 'Bayan ka viral video', cost: 25, p: 0.6, hawa: 3 },
    { id: 'dalbadlu', name: 'Dalbadlu ka sauda', cost: 27, p: 0.55, hawa: 4 },
    { id: 'kanoon', name: 'Kanoon-vyavastha par hamla', cost: 28, p: 0.5, hawa: 5 },
    { id: 'parivar', name: 'Parivaarvaad ka aarop', cost: 26, p: 0.58, hawa: 3 }
];
var MANIFESTO = [
    { id: 'mahila', name: 'Mahila samman rashi', grp: 'Mahilayen', cost: 30, g: 0.07 },
    { id: 'buzurg', name: 'Buzurgon ko pension', grp: 'Buzurg', cost: 28, g: 0.055 },
    { id: 'bachche', name: 'Bachchon ki muft shiksha', grp: 'Bachche aur parivar', cost: 26, g: 0.05 },
    { id: 'yuva', name: 'Yuva rozgar guarantee', grp: 'Yuva', cost: 32, g: 0.065 },
    { id: 'kisan', name: 'Kisan karz-maafi', grp: 'Kisan', cost: 40, g: 0.07 },
    { id: 'vikas', name: 'Expressway aur vikas', grp: 'Sabhi', cost: 35, g: 0.03 }
];
var DONORS = [{ id: 'd1', name: 'Bharat Infra Group', pay: 12 }, { id: 'd2', name: 'Sunrise Telecom', pay: 10 }, { id: 'd3', name: 'Ganga Steel & Power', pay: 14 }, { id: 'd4', name: 'Metro Realty', pay: 8 }, { id: 'd5', name: 'Annapurna Foods', pay: 9 }];
var BLACK_SRC = { foreign: { name: 'Videshi funding', lo: 25, hi: 45, stamina: 8, risk: 14 }, market: { name: 'Kala bazaar (hawala)', lo: 12, hi: 22, stamina: 5, risk: 6 }, kickback: { name: 'Thekedaron se vasooli', lo: 18, hi: 30, stamina: 6, risk: 10 } };
var LAWYERS = [{ id: 'junior', name: 'Junior wakeel', fee: 3, chance: 0.3 }, { id: 'anubhavi', name: 'Anubhavi wakeel', fee: 8, chance: 0.6 }, { id: 'senior', name: 'Senior Advocate', fee: 18, chance: 0.9 }];
var CASE_TOPICS = ['Bhrashtachar', 'Jhoota vaada', 'Funding ki hera-pheri', 'Bhadkau bhashan'];
function lawyerOf(id) { return LAWYERS.filter(function (l) { return l.id === id; })[0] || null; }
function sideName(side) { return side === 'you' ? G.you.main : G.opp.main; }

var _newGameBase = null;
function newGame(o) {
    var __r = newGame0(o); careerPerks(); return __r;
}
function newGame0(o) {
    var you = { main: o.you, allies: o.allies.slice(), camp: [o.you].concat(o.allies) };
    var opp = { main: o.opp, allies: o.oppAllies.slice(), camp: [o.opp].concat(o.oppAllies) };
    G = {
        state: ST.name, you: you, opp: opp, diff: o.diff || 'Normal', incumbent: ST.data.gov,
        quotas: o.quotas || defaultQuotas(you.camp, you.main), alloc: { you: {}, opp: {} },
        phase: 0, round: 1, stage: 'war', done: {}, news: [], spent: 0, mod: { you: newMod(), opp: newMod() },
        hawa: { you: 0, opp: 0 }, stamina: 100, cnt: newCnt(), cmFace: null, manDone: {}, manDoneO: {}, deps: [], donors: {}, loan: { you: null, opp: null }, risk: 0, viol: { you: 0, opp: 0 }, evid: { you: 0, opp: 0 }, defence: { you: null, opp: null }, dq: {}, vips: { you: {}, opp: {} },
        budget: 0, ai: { budget: 0, stamina: 100 }, reveal: false, phaseSnap: [], started: Date.now()
    };
    BASE = {};
    G.alloc.you = autoAlloc(you.camp, you.main, G.quotas);
    G.alloc.opp = autoAlloc(opp.camp, opp.main, defaultQuotas(opp.camp, opp.main));
    G.budget = phaseFund(0);
    G.ai.budget = Math.max(20, phaseFund(0) + dcfg().bonus);
    newsPush('Chunav ka bigul baja: ' + ST.name + ' vidhan sabha, ' + ST.n + ' seat.');
    return G;
}

// ---------- ek action ka dhancha ----------
function act(key, label, cost, stamina, check, apply) { return { key: key, label: label, cost: cost, stamina: stamina, check: check, apply: apply }; }
function inCurPhase(no) { return ST.phases[G.phase].indexOf(no) >= 0; }
function seatName(no) { var s = ST.byNo[no]; return s ? s.nm : '#' + no; }

function A_rallySeat(no) {
    return act('rs' + no, 'Seat rally', 8, 8, function (side) {
        return G.mod[side].rallyS[no] ? 'Is seat par rally ho chuki.' : (inCurPhase(no) ? null : 'Ye seat is phase mein nahi.');
    }, function (side) {
        G.mod[side].rallyS[no] = 0.05; addHawa(side, 1);
        return { text: sideName(side) + ' ki rally ' + seatName(no) + ' mein: bheed umdi, ~5% vote jude.', good: true };
    });
}
function A_rallyDiv(div) {
    return act('rd' + div, 'Division mega-rally', 10, 8, function (side) {
        var n = (G.mod[side].rdn || {})[div] || 0;
        return n >= 5 ? 'Is division mein 5 mega-rally ho chuki (max).' : (phaseSeatsOfDiv(div).length ? null : 'Is division ki seat is phase mein nahi.');
    }, function (side) {
        var m = G.mod[side]; m.rdn = m.rdn || {}; var n = (m.rdn[div] = (m.rdn[div] || 0) + 1);
        m.rallyD[div] = Math.min(0.3, Math.round(n * 0.058 * 1000) / 1000);
        return { text: sideName(side) + ' ne ' + div + ' mein mega-rally ki (' + n + '/5): poore ilake mein ~' + Math.round(m.rallyD[div] * 100) + '% vote.', good: true };
    });
}
function A_rallyState() {
    return act('rst', 'Pradesh-vyapi rally', 25, 15, function (side) {
        return stMod(G.mod[side], G.phase).rally > 0 ? 'Is phase mein pradesh-vyapi rally ho chuki.' : null;
    }, function (side) {
        stMod(G.mod[side], G.phase).rally = 0.01; addHawa(side, 3);
        return { text: sideName(side) + ' ki badi rally ne poore pradesh mein hawa banayi (~1% vote).', good: true };
    });
}
function A_guru(no) {
    return act('gu' + no, 'Local Guru', 4, 3, function (side) {
        return G.mod[side].guru[no] ? 'Is seat par local guru pehle se saath hain.' : (inCurPhase(no) ? null : 'Ye seat is phase mein nahi.');
    }, function (side) {
        G.mod[side].guru[no] = 0.25; addHawa(side, 1);
        return { text: sideName(side) + ' ne ' + seatName(no) + ' ke local guruon ko saath liya: ~25% voter paksh mein.', good: true };
    });
}
function A_karSeat(no) {
    return act('ks' + no, 'Karyakarta (seat)', 5, 3, function (side) {
        return G.mod[side].kar[no] ? 'Is seat par karyakarta pehle se active hain.' : (inCurPhase(no) ? null : 'Ye seat is phase mein nahi.');
    }, function (side) {
        G.mod[side].kar[no] = 0.35;
        return { text: sideName(side) + ' ke karyakarta ' + seatName(no) + ' mein active: ~35% voter paksh mein.', good: true };
    });
}
function kdn(side) { if (!G.cnt.karDivN) G.cnt.karDivN = { you: 0, opp: 0 }; return G.cnt.karDivN[side || 'you'] || 0; }
function A_karDiv(div) {
    var n = phaseSeatsOfDiv(div).length;
    return act('kd' + div, 'Karyakarta (division)', Math.round(6 + 0.1 * n), 4, function (side) {
        if (G.mod[side].karDiv[div]) return 'Is division mein karyakarta pehle se active hain (ek division mein ek baar).';
        if (kdn(side) >= 2) return 'Is phase mein sirf 2 division mein karyakarta lagaye ja sakte hain.';
        return n ? null : 'Is division ki seat is phase mein nahi.';
    }, function (side) {
        var p = Math.round(rnd(0.15, 0.2) * 100) / 100;
        G.mod[side].karDiv[div] = p; G.cnt.karDivN[side] = kdn(side) + 1;
        return { text: sideName(side) + ' ke karyakarta ' + div + ' mein active: ~' + Math.round(p * 100) + '% voter paksh mein.', good: true };
    });
}
function A_mediaDiv(div) {
    return act('md' + div, 'Media campaign (division)', 8, 5, function (side) {
        var n = (G.mod[side].mdn || {})[div] || 0;
        return n >= 5 ? 'Is division mein 5 media campaign ho chuke (max).' : (phaseSeatsOfDiv(div).length ? null : 'Is division ki seat is phase mein nahi.');
    }, function (side) {
        var m = G.mod[side]; m.mdn = m.mdn || {}; m.medD = m.medD || {}; var n = (m.mdn[div] = (m.mdn[div] || 0) + 1);
        m.medD[div] = Math.min(0.3, Math.round(n * 0.058 * 1000) / 1000);
        return { text: sideName(side) + ' ka ' + div + ' mein media campaign (' + n + '/5): ~' + Math.round(m.medD[div] * 100) + '% vote.', good: true };
    });
}
function A_mediaSeat(no) {
    return act('ms' + no, 'Social media (seat)', 3, 2, function (side) {
        return (G.mod[side].medS || {})[no] ? 'Is seat par social media campaign ho chuka.' : (inCurPhase(no) ? null : 'Ye seat is phase mein nahi.');
    }, function (side) {
        G.mod[side].medS = G.mod[side].medS || {}; G.mod[side].medS[no] = 0.12;
        return { text: sideName(side) + ' ne ' + seatName(no) + ' mein social media par zor lagaya: ~12% vote.', good: true };
    });
}
function A_it() {
    return act('it', 'IT Cell', 10, 4, function (side) {
        return stMod(G.mod[side], G.phase).it >= 0.03 ? 'IT Cell ka level poora ho gaya.' : null;
    }, function (side) {
        var m = stMod(G.mod[side], G.phase); m.it = Math.round((m.it + 0.01) * 1000) / 1000; addHawa(side, 1);
        return { text: sideName(side) + ' ke IT Cell ne social media par chha gaya (+1% vote).', good: true };
    });
}
function A_media() {
    return act('media', 'Media debate/vigyapan', 8, 3, function (side) {
        return stMod(G.mod[side], G.phase).media >= 0.024 ? 'Media mein jagah poori bhar gayi.' : null;
    }, function (side) {
        var m = stMod(G.mod[side], G.phase); m.media = Math.round((m.media + 0.008) * 1000) / 1000; addHawa(side, 3);
        return { text: sideName(side) + ' ne TV debate aur vigyapan se hawa banayi.', good: true };
    });
}
function A_manifesto(id) {
    var m = MANIFESTO.filter(function (x) { return x.id === id; })[0];
    return act('mf' + id, 'Ghoshna-patra', m.cost, 0, function (side) {
        var d = side === 'you' ? G.manDone : (G.manDoneO || (G.manDoneO = {}));
        return d[id] ? 'Ye vaada pehle hi ghoshit ho chuka.' : null;
    }, function (side) {
        var d = side === 'you' ? G.manDone : (G.manDoneO || (G.manDoneO = {})); d[id] = 1;
        var mod = G.mod[side]; mod.man = Math.min(0.3, Math.round((1 - (1 - mod.man) * (1 - m.g)) * 1000) / 1000);
        return { text: sideName(side) + ' ne \"' + m.name + '\" ka vaada kiya (' + m.grp + ': ~' + (m.g * 100).toFixed(1) + '% vote).', good: true };
    });
}
function A_contro(id) {
    var c = CONTRO.filter(function (x) { return x.id === id; })[0];
    return act('co' + id, c.name, c.cost, 6, function (side) {
        return G.cnt.contro[side] >= 2 ? 'Is phase mein max 2 controversy hi ho sakti hain.' : null;
    }, function (side) {
        G.cnt.contro[side]++;
        var rival = side === 'you' ? 'opp' : 'you', ph = G.phase, ok = Math.random() < c.p;
        if (ok) {
            G.mod[rival].cut[ph] = (G.mod[rival].cut[ph] || 0) + 0.15; addHawa(side, c.hawa); addHawa(rival, -2);
            return { text: sideName(side) + ' ka "' + c.name + '" daav chal gaya! ' + sideName(rival) + ' ka 15% vote share gaya.', good: true };
        }
        G.mod[side].cut[ph] = (G.mod[side].cut[ph] || 0) + 0.02; addHawa(side, -c.hawa);
        return { text: sideName(side) + ' ka "' + c.name + '" daav ulta pada! 2% vote share ka nuksan.', good: false };
    });
}
function A_official(no, kind) {
    var dm = kind === 'DM';
    return act((dm ? 'dm' : 'sp') + no, dm ? 'DM badlo' : 'SP badlo', dm ? 12 : 9, 4, function (side) {
        return G.mod[side].off[no] ? 'Is seat par DM/SP ka tabadla ho chuka (ek seat par ek hi).' : (inCurPhase(no) ? null : 'Ye seat is phase mein nahi.');
    }, function (side) {
        G.mod[side].off[no] = dm ? 0.2 : 0.15; if (G.viol) G.viol[side] = (G.viol[side] || 0) + 1;
        var t = sideName(side) + ' ne ' + seatName(no) + ' mein ' + (dm ? 'DM' : 'SP') + ' badla: ~' + (dm ? 20 : 15) + '% vote fayda.';
        if (Math.random() < 0.35) { addHawa(side, -3); if (side === 'you') { G.budget = Math.max(0, G.budget - 5); } else { G.ai.budget = Math.max(0, G.ai.budget - 5); } return { text: t + ' Par bhed khul gaya! Hawa gira, 5 Cr jurmana.', good: false }; }
        return { text: t, good: true };
    });
}
function A_poach(no) {
    return act('po' + no, 'Dalbadlu (prataashi)', 15, 5, function (side) {
        return G.mod[side].poach[no] ? 'Is seat par sauda ho chuka.' : (inCurPhase(no) ? null : 'Ye seat is phase mein nahi.');
    }, function (side) {
        if (G.viol) G.viol[side] = (G.viol[side] || 0) + 1;
        if (Math.random() < 0.6) { G.mod[side].poach[no] = 0.15; addHawa(side, 1); return { text: sideName(side) + ' ne ' + seatName(no) + ' mein virodhi khemey ka bada neta tod liya (~15% vote).', good: true }; }
        addHawa(side, -2); return { text: sideName(side) + ' ka ' + seatName(no) + ' mein dalbadlu ka daav fail raha.', good: false };
    });
}
function A_survey() {
    return act('sv', 'Survey', 10, 5, function () { return revealed() ? 'Is phase ke rujhan pehle se dikh rahe hain.' : null; }, function () {
        G.reveal = true; return { text: 'Survey agency ne rujhan diye: seat-wise andaza ab map par hai (final natija badal bhi sakta hai).', good: true };
    });
}
function A_donor() {
    return act('donor', 'Chanda (safed)', 0, 4, function (side) { return G.cnt.donor >= 2 ? 'Is phase mein chande ki limit poori.' : null; }, function () {
        G.cnt.donor++; G.budget += 20; return { text: 'Chande se 20 Cr jama hue.', good: true };
    });
}
function A_donorDeal(id) {
    var d = DONORS.filter(function (x) { return x.id === id; })[0];
    return act('dn' + id, 'Corporate partner', 2, 3, function (side) {
        var o = G.donors[id]; return o ? (o === side ? 'Ye udyogpati pehle se aapke saath hai.' : 'Ye udyogpati doosre khemey ke saath hai.') : null;
    }, function (side) {
        if (Math.random() < 0.55) { G.donors[id] = side; addBudget(side, Math.round(d.pay / 2)); return { text: d.name + ' ab ' + sideName(side) + ' ke saath hai: har phase ' + d.pay + ' Cr milenge.', good: true }; }
        return { text: d.name + ' ne abhi haan nahi kaha.', good: false };
    });
}
function A_blackSrc(kind) {
    var k = BLACK_SRC[kind];
    return act('bk' + kind, k.name, 0, k.stamina, function () { return G.cnt.black >= 2 ? 'Is phase mein 2 baar hi kala dhan ban sakta hai.' : null; }, function (side) {
        G.cnt.black++; var amt = k.lo + Math.floor(Math.random() * (k.hi - k.lo + 1)); addBudget(side, amt);
        if (side === 'you') { G.risk = (G.risk || 0) + k.risk; G.viol.you = (G.viol.you || 0) + 1; }
        var extra = '';
        if (kind === 'foreign' && Math.random() < 0.25) { G.mod[side].cut[G.phase] = (G.mod[side].cut[G.phase] || 0) + 0.02; extra = ' Videshi chande par jaanch ki khabar, 2% vote ghata.'; }
        return { text: k.name + ': ' + amt + ' Cr jut gaye.' + extra, good: true };
    });
}
function A_loan(amt) {
    return act('ln' + amt, 'Loan', 0, 2, function () { return G.loan.you ? 'Pehle wala loan abhi baaki hai.' : null; }, function () {
        G.budget += amt; G.loan.you = { due: Math.round(amt * 1.25) };
        return { text: amt + ' Cr ka loan mila. Agle phase mein ' + Math.round(amt * 1.25) + ' Cr lautane honge.', good: true };
    });
}
function A_rest(kind) {
    var t = kind === 'team' ? { cost: 8, gain: 35, lim: 1, name: 'Energy team (doctor + helicopter)', k: 'team' } : { cost: 3, gain: 20, lim: 2, name: 'Aaram', k: 'rest' };
    return act('rest_' + kind, t.name, t.cost, 0, function (side) {
        if ((G.cnt[t.k + (side === 'you' ? '' : 'O')] || 0) >= t.lim) return 'Is phase mein ' + t.name + ' sirf ' + t.lim + ' baar.';
        return side === 'you' && G.stamina >= 100 ? 'Stamina pehle se poori hai.' : null;
    }, function (side) { var ck = t.k + (side === 'you' ? '' : 'O'); G.cnt[ck] = (G.cnt[ck] || 0) + 1; addStamina(side, t.gain); return { text: t.name + ': stamina +' + t.gain + '%.', good: true }; });
}
function A_court(topic, lid) {
    var L = lawyerOf(lid) || LAWYERS[1];
    return act('ct', 'Court case', L.fee, 5, function (side) { return G.cnt.court[side] >= 2 ? 'Is phase mein 2 court case hi.' : null; }, function (side) {
        G.cnt.court[side]++;
        var rival = side === 'you' ? 'opp' : 'you', dl = lawyerOf(G.defence[rival]), p = L.chance * (1 - 0.7 * (dl ? dl.chance : 0));
        if (side === 'you' && G.judgePerk) p = 0.97;
        if (Math.random() < p) {
            G.mod[rival].cut[G.phase] = (G.mod[rival].cut[G.phase] || 0) + 0.1;
            if (topic === 'Funding ki hera-pheri') { if (rival === 'you') G.budget = Math.max(0, G.budget - 12); else G.ai.budget = Math.max(0, G.ai.budget - 12); }
            if (topic === 'Bhadkau bhashan') addStamina(rival, -15);
            if (topic === 'Jhoota vaada') { var rm = G.mod[rival]; Object.keys(rm.st).forEach(function (k) { rm.st[k].it *= 0.5; rm.st[k].media *= 0.5; }); rm.man *= 0.7; }
            return { text: 'Court ne ' + sideName(side) + ' ki arzi (' + topic + ') maani. ' + sideName(rival) + ' ka 10% vote share gaya.', good: true };
        }
        G.mod[side].cut[G.phase] = (G.mod[side].cut[G.phase] || 0) + 0.02;
        return { text: 'Court ne ' + sideName(side) + ' ki arzi (' + topic + ') khaarij ki.' + (dl ? ' Bachav wakeel kaam aaya.' : ''), good: false };
    });
}
function A_defence(lid) {
    var L = lawyerOf(lid);
    return act('df', 'Bachav wakeel', L.fee, 1, function (side) { return G.defence[side] ? 'Is phase ke liye bachav wakeel pehle se hai.' : null; }, function (side) {
        G.defence[side] = lid; return { text: sideName(side) + ' ne ' + L.name + ' ko bachav ke liye rakha.', good: true };
    });
}
function A_spy() {
    return act('spy', 'Jasoos', 5, 2, function (side) { return G.cnt.spy[side] >= 2 ? 'Is phase mein 2 jasoos mishan ho chuke.' : null; }, function (side) {
        G.cnt.spy[side]++; var rival = side === 'you' ? 'opp' : 'you', v = G.viol[rival] || 0;
        if (!v) return { text: 'Jasoos ko rival ki taraf se koi gadbad nahi mili.', good: false };
        if (Math.random() < 0.75) { var f = Math.min(3, v); G.evid[side] = (G.evid[side] || 0) + f; G.viol[rival] = v - f; return { text: 'Jasoos ne ' + f + ' aachar-sanhita ulanghan ka sabut jutaya.', good: true }; }
        return { text: 'Jasoos pakda gaya, kuch haath nahi laga.', good: false };
    });
}
function A_mcc() {
    return act('mcc', 'EC shikayat (MCC)', 3, 3, function (side) {
        return ((G.evid[side] || 0) < 1 && !(side === 'you' && G.ecPerk)) ? 'Pehle jasoos (Spy) se sabut jutao.' : (G.cnt.mcc[side] >= 1 ? 'Is phase mein ek hi shikayat.' : null);
    }, function (side) {
        G.cnt.mcc[side]++; var rival = side === 'you' ? 'opp' : 'you', ev = (side === 'you' && G.ecPerk) ? Math.max(3, G.evid[side] || 0) : (G.evid[side] || 0);
        if (Math.random() < Math.min(0.85, 0.35 + 0.15 * ev)) {
            var cand = ST.phases[G.phase].filter(function (no) { return !G.done[no] && !G.dq[no] && leadOf(no).id === rival; }), n = 0, k = Math.min(ev, cand.length);
            while (n < k) { var i = Math.floor(Math.random() * cand.length); G.dq[cand.splice(i, 1)[0]] = rival; n++; }
            G.evid[side] = 0;
            return { text: 'EC ne ' + sideName(rival) + ' ke ' + k + ' ummeedwar ka namankan radd kiya.', good: true };
        }
        return { text: 'EC ne shikayat par koi karyavahi nahi ki.', good: false };
    });
}
function A_vip(no, name) {
    return act('vp' + no, 'VIP ummeedwar', 3, 0, function (side) {
        return G.vips[side][no] ? 'Ye seat pehle se VIP hai.' : (!inCurPhase(no) ? 'Ye seat is phase mein nahi.' : (Object.keys(G.vips[side]).length >= 8 ? 'Zyada se zyada 8 VIP seat.' : null));
    }, function (side) {
        var nm = name || nameGen(); G.vips[side][no] = { name: nm, won: null }; G.mod[side].vip = G.mod[side].vip || {}; G.mod[side].vip[no] = 0.15;
        return { text: sideName(side) + ' ne ' + nm + ' ko ' + seatName(no) + ' se VIP ummeedwar banaya (+15% vote).', good: true };
    });
}
function A_dep(name) {
    return act('dp', 'Upmukhyamantri chehra', 0, 0, function () {
        return G.deps.indexOf(name) >= 0 ? 'Ye pehle se chuna ja chuka hai.' : (name === G.cmFace ? 'Ye CM chehra hain.' : (G.deps.length >= 4 ? 'Zyada se zyada 4 upmukhyamantri chehre.' : null));
    }, function () {
        G.deps.push(name); var m = G.mod.you; m.man = Math.min(0.3, Math.round((1 - (1 - m.man) * (1 - 0.004)) * 1000) / 1000);
        return { text: name + ' ko upmukhyamantri ka chehra banaya.', good: true };
    });
}
function A_cmFace(name) {
    return act('cmf', 'CM chehra', 0, 0, function () { return G.cmFace ? 'CM chehra pehle hi tay ho chuka.' : (G.deps.indexOf(name) >= 0 ? 'Ye upmukhyamantri chehre mein hain.' : null); }, function () {
        G.cmFace = name; var m = G.mod.you; m.man = Math.min(0.3, Math.round((1 - (1 - m.man) * (1 - 0.01)) * 1000) / 1000);
        return { text: name + ' ko mukhyamantri ka chehra ghoshit kiya.', good: true };
    });
}
function blackRaid() {
    if ((G.risk || 0) <= 0) return;
    if (Math.random() * 100 < Math.min(60, G.risk)) {
        var loss = Math.min(G.budget, Math.round(rnd(20, 35)));
        G.budget -= loss; G.risk = Math.floor(G.risk / 2); G.mod.you.cut[G.phase] = (G.mod.you.cut[G.phase] || 0) + 0.02;
        newsPush('IT/ED ka chhapa! Aapke ' + loss + ' Cr zabt, saakh giri (2% vote ghata).');
    } else G.risk = Math.max(0, G.risk - 3);
}
function vipResults(nos) {
    ['you', 'opp'].forEach(function (side) {
        nos.forEach(function (no) {
            var v = G.vips[side][no]; if (!v || v.won != null) return;
            var d = G.done[no]; v.won = !!d && d.id === side;
            if (side === 'you') newsPush(v.name + ' (' + seatName(no) + ') ' + (v.won ? 'jeete!' : 'haare.'));
        });
    });
}
function phaseStartMoney() {
    DONORS.forEach(function (d) { var o = G.donors[d.id]; if (o === 'you') G.budget += d.pay; else if (o === 'opp') G.ai.budget += d.pay; });
    var burden = 4 * Object.keys(G.manDone).length;
    if (burden) { var b = Math.min(G.budget, burden); G.budget -= b; newsPush('Chunavi vaadon ka bojh: ' + b + ' Cr kharch.'); }
    var Ln = G.loan.you;
    if (Ln) {
        var pay = Math.min(Ln.due, G.budget); G.budget -= pay; Ln.due -= pay;
        if (Ln.due > 0) { Ln.due = Math.round(Ln.due * 1.1); G.mod.you.cut[G.phase] = (G.mod.you.cut[G.phase] || 0) + 0.01; newsPush('Loan nahi chuka paye, saakh giri.'); } else { G.loan.you = null; newsPush('Loan chuka diya.'); }
    }
    G.defence = { you: null, opp: null };
}

function saveGame() { try { localStorage.setItem(SA_SAVE, JSON.stringify({ G: G })); } catch (e) {} }
function loadSave() { try { return JSON.parse(localStorage.getItem(SA_SAVE)); } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(SA_SAVE); } catch (e) {} }

function execYou(a) {
    var why = a.check('you');
    if (why) return { ok: false, text: why };
    if (G.budget < a.cost) return { ok: false, text: 'Budget kam hai (' + a.cost + ' Cr chahiye).' };
    if (G.stamina < a.stamina) return { ok: false, text: 'Stamina kam hai (' + a.stamina + '% chahiye).' };
    G.budget -= a.cost; G.spent += a.cost; G.stamina -= a.stamina;
    var r = a.apply('you');
    newsPush(r.text); saveGame();
    return { ok: true, text: r.text, good: r.good !== false };
}

// ---------- AI ----------
function aiTry(a) {
    if (a.check('opp')) return false;
    if (G.ai.budget < a.cost) return false;
    if (G.ai.stamina == null) G.ai.stamina = 100;
    if (G.ai.stamina < a.stamina) return false;
    G.ai.budget -= a.cost; G.ai.stamina -= a.stamina;
    var r = a.apply('opp');
    if (Math.random() < 0.4) newsPush(r.text);
    return true;
}
// AI ka nazariya: har seat mein rival (AI) kitna peeche/aage hai
function aiSeatRows(nos) {
    return nos.map(function (no) {
        var e = entityList(no, false), top = e[0], me = e.filter(function (x) { return x.id === 'opp'; })[0] || e[e.length - 1];
        var lead = top.id === 'opp';
        return { no: no, lead: lead, gap: lead ? -(top.s - (e[1] ? e[1].s : 0)) : (top.s - me.s) };
    });
}
// AI ek round mein kaise khelta hai: budget-stamina ki seema, kaante ki seat par dhyan,
// pehle round mein pradesh-vyapi taiyari, aur level ke hisaab se jokhim.
function aiRound() {
    var L = dcfg(), nos = ST.phases[G.phase].slice(), left = Math.max(1, ROUNDS - G.round + 1);
    if (G.ai.stamina == null) G.ai.stamina = 100;
    var cap = Math.max(0, G.ai.budget) / left * L.spend, used = 0;
    var rows = aiSeatRows(nos);
    rows.forEach(function (r) { r.k = Math.abs(r.gap) + rnd(0, (1 - L.smart) * 0.35); if (r.gap > 0.2) r.k += 0.5; });
    rows.sort(function (a, b) { return a.k - b.k; });
    var pool = rows.slice(0, Math.max(5, Math.round(nos.length * (0.15 + 0.25 * L.smart))));
    var go = function (a) { if (used + a.cost > cap * 1.15 + 1) return false; if (!aiTry(a)) return false; used += a.cost; return true; };
    if (G.round === 1 && L.smart >= 0.6) {
        if (Math.random() < 0.7) go(A_it());
        if (Math.random() < 0.6) go(A_media());
        if (L.smart >= 0.85 && Math.random() < 0.5) go(A_rallyState());
    }
    if (L.smart >= 0.6 && pool.length) {
        var dv = ST.byNo[pool[0].no].div, opts = [A_rallyDiv(dv), A_mediaDiv(dv)];
        if (kdn('opp') < 2) opts.push(A_karDiv(dv));
        go(pick(opts));
    }
    if (G.round === 1 && L.smart >= 0.6) {
        var left2 = MANIFESTO.filter(function (x) { return !(G.manDoneO || {})[x.id]; });
        if (left2.length && Math.random() < 0.6) go(A_manifesto(pick(left2).id));
        var fd = DONORS.filter(function (d) { return !G.donors[d.id]; });
        if (fd.length && Math.random() < 0.5) go(A_donorDeal(pick(fd).id));
    }
    if (G.ai.stamina < 25 && G.ai.budget > 12) go(A_rest('aaram'));
    for (var i = 0; i < L.n && pool.length; i++) {
        var t = pool[i % pool.length], no = t.no, order = [A_guru(no), A_karSeat(no), A_rallySeat(no)];
        if (L.risky > 0 && Math.random() < L.risky) order.push(A_official(no, Math.random() < 0.5 ? 'DM' : 'SP'));
        if (L.risky > 0.2 && Math.random() < L.risky * 0.6) order.push(A_poach(no));
        if (t.lead && t.gap < -0.12 && L.smart >= 0.6) order = order.slice(0, 1);
        for (var j = 0; j < order.length; j++) { if (go(order[j])) break; }
    }
    if (L.risky > 0 && G.cnt.contro.opp < 2 && Math.random() < L.risky * 0.8) { var c = pick(CONTRO); go(A_contro(c.id)); }
}

// ---------- round / phase ----------
function decayHawa(f) { G.hawa.you = Math.round(G.hawa.you * f * 10) / 10; G.hawa.opp = Math.round(G.hawa.opp * f * 10) / 10; }
function endRound() {
    aiRound();
    G.ai.stamina = 100; G.reveal = true;
    G.stamina = 100;
    decayHawa(0.85); blackRaid();
    if (G.round >= ROUNDS) return endPhase();
    G.round++;
    G.budget += ROUND_BONUS; G.ai.budget += ROUND_BONUS;
    newsPush('Round ' + (G.round - 1) + ' khatm. ' + ROUND_BONUS + ' Cr ka naya funding mila.');
    saveGame();
    return { phaseEnded: false };
}
function endPhase() {
    var nos = ST.phases[G.phase], before = tallyDone();
    nos.forEach(function (no) { decideSeat(no); });
    var after = tallyDone();
    var res = { ph: G.phase, seats: nos.length, you: after.you - before.you, opp: after.opp - before.opp, oth: after.oth - before.oth, total: after };
    res.parties = {}; nos.forEach(function (no) { var d = G.done[no]; res.parties[d.party] = (res.parties[d.party] || 0) + 1; });
    res.close = nos.map(function (no) { return { no: no, d: G.done[no] }; }).sort(function (a, b) { return a.d.margin - b.d.margin; }).slice(0, 5);
    G.lastPhase = res; vipResults(nos);
    saveGame();
    return { phaseEnded: true, res: res };
}
function nextPhase() {
    decayHawa(0.6);
    G.phase++; G.round = 1; G.stamina = 100; G.cnt = newCnt(); G.reveal = false; G.ai.stamina = 100;
    G.budget += phaseFund(G.phase); G.ai.budget += phaseFund(G.phase) + Math.max(0, Math.round(dcfg().bonus / 3));
    phaseStartMoney();
    newsPush('Phase ' + (G.phase + 1) + ' shuru: ' + phaseFund(G.phase) + ' Cr ka phase fund mila.');
    saveGame();
}
function allDone() { return Object.keys(G.done).length >= ST.n; }

// ---------- ginti ke baad ----------
function campSeatsByParty(side) {
    var m = {};
    Object.keys(G.done).forEach(function (no) { var d = G.done[no]; if (d.id === side) m[d.party] = (m[d.party] || 0) + 1; });
    return m;
}
function sumVals(o) { return Object.keys(o).reduce(function (a, k) { return a + o[k]; }, 0); }
function exitPoll() {
    var t = tallyDone(), e = function (v) { var err = Math.round(ST.n * rnd(-0.06, 0.06)); return clamp(v + err, 0, ST.n); };
    var y = e(t.you), o = e(t.opp);
    var span = Math.max(4, Math.round(ST.n * 0.04));
    return { you: [Math.max(0, y - span), y + span], opp: [Math.max(0, o - span), o + span], oth: Math.max(0, ST.n - y - o) };
}
// horse trading state
function startHT() {
    var ht = { round: 1, rounds: 3, you: campSeatsByParty('you'), opp: campSeatsByParty('opp'), oth: {}, log: [], fund: G.budget };
    Object.keys(G.done).forEach(function (no) { var d = G.done[no]; if (d.id !== 'you' && d.id !== 'opp') ht.oth[d.party] = (ht.oth[d.party] || 0) + 1; });
    G.ht = ht; saveGame();
    return ht;
}
function htTot(ht, side) { return sumVals(ht[side]); }
function htCost(ht, from, party, n) {
    var per = (from === 'opp' ? 6 : 3.5) + Math.min(4, (ht[from][party] || 0) * 0.04);
    return Math.round(per * n);
}
function htBuy(from, party, n) {
    var ht = G.ht, have = ht[from][party] || 0;
    n = Math.min(n, have);
    if (n <= 0) return { ok: false, text: 'Is dal ke paas vidhayak nahi bache.' };
    var cost = htCost(ht, from, party, n);
    if (G.budget < cost) return { ok: false, text: 'Budget kam hai (' + cost + ' Cr).' };
    G.budget -= cost; G.spent += cost;
    var p = from === 'opp' ? 0.6 : 0.75;
    if (Math.random() < p) {
        ht[from][party] -= n; ht.you[party + ' (kharide)'] = (ht.you[party + ' (kharide)'] || 0) + n;
        var t = n + ' vidhayak ' + party + ' se aapke saath aa gaye! (' + cost + ' Cr)';
        ht.log.unshift(t); saveGame(); return { ok: true, text: t, good: true };
    }
    var lost = Math.round(n * 0.25); addHawa('you', -2);
    var t2 = party + ' ke vidhayak nahi toote. ' + cost + ' Cr gaye, hawa giri.';
    ht.log.unshift(t2); saveGame(); return { ok: true, text: t2, good: false };
}
function htAiMove() {
    var ht = G.ht, n = DIFF[G.diff].n, logs = [];
    var youMajGap = ST.maj - htTot(ht, 'you'), oppGap = ST.maj - htTot(ht, 'opp');
    // AI aapke saathiyon ko todne ki koshish
    var allies = Object.keys(ht.you).filter(function (p) { return p !== G.you.main && ht.you[p] > 0; });
    if (allies.length && Math.random() < 0.35 + n * 0.05) {
        var p = pick(allies), k = Math.min(ht.you[p], Math.ceil(rnd(1, 2 + n)));
        if (Math.random() < 0.55) { ht.you[p] -= k; ht.opp[p + ' (toot)'] = (ht.opp[p + ' (toot)'] || 0) + k; logs.push('Virodhi ne ' + p + ' ke ' + k + ' vidhayak tod liye!'); }
        else logs.push('Virodhi ne ' + p + ' ko todne ki koshish ki, par vo nahi toote.');
    }
    var oth = Object.keys(ht.oth).filter(function (p) { return ht.oth[p] > 0; });
    if (oth.length && Math.random() < 0.5) {
        var q = pick(oth), m = Math.min(ht.oth[q], Math.ceil(rnd(1, 2 + n)));
        if (Math.random() < 0.6) { ht.oth[q] -= m; ht.opp[q + ' (samarthan)'] = (ht.opp[q + ' (samarthan)'] || 0) + m; logs.push('Virodhi ko ' + q + ' ke ' + m + ' vidhayakon ka samarthan mil gaya.'); }
    }
    logs.forEach(function (t) { ht.log.unshift(t); });
    return logs;
}
function htFinish() {
    var ht = G.ht, y = htTot(ht, 'you'), o = htTot(ht, 'opp');
    G.final = { you: y, opp: o, oth: ST.n - y - o, byYou: ht.you, byOpp: ht.opp };
    var res;
    if (y >= ST.maj) res = 'win'; else if (o >= ST.maj) res = 'lose'; else res = 'hung';
    G.result = res;
    return res;
}

// =============================================================
//  UI: CSS + shell
// =============================================================
var SA = { ui: {}, map: null, layers: {}, sel: null, selDiv: null, msg: '', panel: null, timer: null, layer: null };

function css2() {
    if (document.getElementById('sa-css2')) return;
    var st = document.createElement('style'); st.id = 'sa-css2';
    st.textContent = ".sa-emw{display:inline-flex;align-items:center;justify-content:center;border-radius:12px;overflow:hidden;background:#fff;flex:none;box-shadow:0 2px 8px rgba(0,0,0,.35)}\n.sa-emw img,.sa-emw .s22-logo,.sa-emw .s22-badge{width:100%!important;height:100%!important;object-fit:contain;display:flex;align-items:center;justify-content:center;border-radius:0}\n.sa-emw.xs{border-radius:6px}.sa-emw.lg{border-radius:16px}\n.sa-top{gap:8px!important;flex-wrap:nowrap!important;padding:8px 10px!important;background:linear-gradient(180deg,#0f2128,#0b171c)!important}\n.sa-ban{flex:1 1 0;min-width:0;display:flex;align-items:center;gap:10px;padding:8px 14px;border-radius:14px;position:relative;overflow:hidden;background:linear-gradient(100deg,var(--c),#071016 135%);color:#fff;box-shadow:0 4px 14px rgba(0,0,0,.35);animation:saBanIn .6s ease both}\n.sa-ban.r{flex-direction:row-reverse;text-align:right;background:linear-gradient(260deg,var(--c),#071016 135%)}\n.sa-ban .lg{display:flex;align-items:center;gap:4px;flex:none}\n.sa-ban .nm{min-width:0;flex:1}.sa-ban .nm b{display:block;font:400 17px/1.1 \"Yatra One\",Hind,serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sa-ban .nm small{opacity:.85;font-size:11px;letter-spacing:1px;text-transform:uppercase}\n.sa-ban .ct{flex:none;text-align:center;min-width:70px}.sa-ban .ct span{display:block;font:400 34px/1 \"Yatra One\",Hind,serif;font-variant-numeric:tabular-nums;text-shadow:0 2px 6px rgba(0,0,0,.4)}\n.sa-ban .ct i{display:block;height:5px;border-radius:3px;background:#fff;opacity:.85;margin-top:3px;transition:width .6s}\n.sa-ban::after{content:\"\";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.16) 50%,transparent 65%);transform:translateX(-120%);animation:saSweep 5s ease-in-out infinite;pointer-events:none}\n.sa-mid{flex:none;text-align:center;padding:0 6px}.sa-mid .ttl{font:400 20px/1.1 \"Yatra One\",Hind,serif}.sa-mid .sub{font-size:12px;color:var(--mu)}.sa-mid .sub b{color:var(--tx)}\n.sa-mid .sav{font-size:10.5px;color:#58c49a;display:flex;justify-content:center;gap:5px;align-items:center}.sa-mid .sav i{width:6px;height:6px;border-radius:50%;background:#58c49a;animation:saPulse 1.6s infinite}\n@keyframes saBanIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}\n@keyframes saSweep{0%{transform:translateX(-120%)}60%,100%{transform:translateX(120%)}}\n@keyframes saPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.5)}}\n@keyframes saFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes saPop{0%{opacity:0;transform:scale(.6)}70%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}\n@keyframes saShim{0%{background-position:-200px 0}100%{background-position:200px 0}}\n@keyframes saSlide{0%{margin-left:-40%}100%{margin-left:100%}}\n@keyframes saFall{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:.9}}\n@keyframes saGlow{0%,100%{box-shadow:0 0 0 rgba(240,176,74,0)}50%{box-shadow:0 0 26px rgba(240,176,74,.55)}}\n.sa-fade{animation:saFadeUp .5s ease both}\n.sa-bottom{grid-template-columns:1fr 1fr 1.2fr!important}\n.sa-vt{display:flex;flex-direction:column;gap:8px;margin-top:10px}\n.sa-vchip{align-self:flex-start;display:inline-flex;gap:7px;align-items:center;padding:4px 12px;border-radius:20px;background:rgba(56,189,248,.18);color:#7dd3fc;font-weight:700;letter-spacing:2px;font-size:12px}.sa-vchip i{width:8px;height:8px;border-radius:50%;background:#38bdf8;animation:saPulse 1s infinite}\n.sa-vnm b{display:block;font:400 22px/1.1 \"Yatra One\",Hind,serif}.sa-vnm small{color:var(--mu)}\n.sa-vbar{height:6px;border-radius:4px;background:#0a1417;overflow:hidden}.sa-vbar u{display:block;height:100%;width:40%;border-radius:4px;background:linear-gradient(90deg,#38bdf8,#8aa4ff);animation:saSlide 1.8s ease-in-out infinite}\n.sa-vlead{display:flex;align-items:center;gap:8px}.sa-vlead span{margin-left:auto;font-weight:700;color:#cbd5e1}\n.sa-tp{height:6px;border-radius:4px;background:#0a1417;overflow:hidden;margin:8px 0}.sa-tp i{display:block;height:100%;border-radius:4px;background:linear-gradient(90deg,#58c49a,#f0b04a);transition:width .8s}\n.sa-dr{display:grid;grid-template-columns:1fr 1.4fr 26px;gap:8px;align-items:center;font-size:12.5px;margin:3px 0}.sa-dr span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sa-dr b{text-align:right;color:var(--mu)}\n.sa-dbar{display:flex;height:9px;border-radius:5px;overflow:hidden;background:#0a1417}.sa-dbar i{display:block;height:100%;transition:width .6s}.sa-dbar.sh i{background:linear-gradient(90deg,#1b363d 20%,#38586a 50%,#1b363d 80%);background-size:200px 100%;animation:saShim 1.4s linear infinite}\n.sa-legend{display:none!important}\n.sa-seatcard{background:linear-gradient(180deg,rgba(14,32,40,.97),rgba(9,22,28,.97))!important;border:1px solid #2f5560!important;border-top:4px solid #f0b04a!important;color:#e8f1ee}\n.sa-seatcard .q .sa-btn{border:0!important;border-radius:10px;font-weight:700;color:#10202a!important;box-shadow:none}.sa-seatcard .q .b1{background:#f0b04a!important}.sa-seatcard .q .b2{background:#58c49a!important}.sa-seatcard .q .b3{background:#8aa4ff!important}\n.sa-sec{margin:14px 0 6px;color:var(--gold);font-weight:700;letter-spacing:1px;font-size:12.5px;text-transform:uppercase}\n.sa-slider input[type=range]{-webkit-appearance:none;appearance:none;height:10px;border-radius:6px;background:linear-gradient(90deg,#58c49a,#f0b04a);outline:none;margin:12px 0}\n.sa-slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:26px;height:26px;border-radius:50%;background:#fff;border:4px solid #f0b04a;box-shadow:0 2px 8px rgba(0,0,0,.5);cursor:pointer}\n.sa-slider input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:4px solid #f0b04a;cursor:pointer}\n.sa-slider .qk{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:6px}\n.sa-sbox{transition:transform .2s}.sa-sbox:hover{transform:translateY(-2px)}\n.sa-sbox .n{font:400 34px/1 \"Yatra One\",Hind,serif;margin-left:auto}\n.sa-sbar{display:flex;height:34px;border-radius:12px;overflow:hidden;background:#0a1417}.sa-sbar i{display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-style:normal;text-shadow:0 1px 3px rgba(0,0,0,.6);transition:width .35s;overflow:hidden}.sa-sbar i b{font-size:13px}\n.sa-cb{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:stretch;margin-bottom:14px}\n.sa-cbn{display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:18px;background:linear-gradient(110deg,var(--c),#071016 140%);color:#fff;position:relative;overflow:hidden}\n.sa-cbn.r{flex-direction:row-reverse;text-align:right;background:linear-gradient(250deg,var(--c),#071016 140%)}\n.sa-cbn b.n{font:400 54px/1 \"Yatra One\",Hind,serif;font-variant-numeric:tabular-nums;margin-left:auto}.sa-cbn.r b.n{margin-left:0;margin-right:auto}\n.sa-cbn .w{font:400 19px/1.1 \"Yatra One\",Hind,serif}.sa-cbn small{opacity:.85}\n.sa-cbn.lead{animation:saGlow 1.6s infinite}\n.sa-cmid{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 8px;text-align:center}.sa-cmid b{font:400 34px/1 \"Yatra One\",Hind,serif}\n.sa-lv2{display:inline-flex;gap:7px;align-items:center;padding:4px 12px;border-radius:20px;background:rgba(224,103,74,.18);color:#fca5a5;font-weight:700;letter-spacing:2px;font-size:12px;margin-bottom:6px}.sa-lv2 i{width:8px;height:8px;border-radius:50%;background:#e0674a;animation:saPulse 1s infinite}\n.sa-mbar{position:relative;display:flex;height:34px;border-radius:14px;overflow:hidden;background:#0a1417;margin:6px 0 24px}.sa-mbar i{display:block;height:100%;transition:width .5s}\n.sa-mbar u{position:absolute;top:-4px;bottom:-4px;width:3px;background:#f0b04a;text-decoration:none}.sa-mbar u em{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:6px;white-space:nowrap;font-style:normal;font-size:11.5px;color:#f0b04a}\n.sa-rs{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:12px;background:var(--cd);border:1px solid var(--ln);border-left:5px solid var(--c);margin-bottom:6px;animation:saFadeUp .4s ease both}.sa-rs .t{flex:1;min-width:0}.sa-rs .t b{display:block}.sa-rs .t small{color:var(--mu)}\n.sa-hero{text-align:center;padding:26px 16px;border-radius:22px;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 0,rgba(240,176,74,.22),rgba(255,255,255,.02) 70%);border:1px solid rgba(240,176,74,.45);animation:saPop .7s ease both}\n.sa-hero h2{font:400 34px/1.15 \"Yatra One\",Hind,serif;margin:6px 0}.sa-hero .big{font-size:3.4rem}\n.sa-conf{position:absolute;inset:0;pointer-events:none;overflow:hidden}.sa-conf i{position:absolute;top:-20px;width:8px;height:14px;border-radius:2px;animation:saFall 3.6s linear infinite}\n.sa-pick{display:flex;flex-wrap:wrap;gap:10px}.sa-pk{cursor:pointer;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;background:var(--cd);border:1px solid var(--ln);border-left:5px solid var(--c);transition:transform .2s,border-color .2s;min-width:230px}.sa-pk:hover{transform:translateY(-3px);border-color:var(--c)}.sa-pk.sel{border-color:#f0b04a;background:rgba(240,176,74,.12)}\n.sa-pk b{display:block}.sa-pk small{color:var(--mu)}\n.sa-cabr{display:grid;grid-template-columns:1.1fr 1.4fr;gap:10px;align-items:center;padding:8px 12px;border-radius:12px;background:var(--cd);border:1px solid var(--ln);margin-bottom:6px;animation:saFadeUp .4s ease both}.sa-cabr small{color:var(--mu);display:block}.sa-cabr select{width:100%}\n.sa-quota{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.sa-quota .sa-chip.low{border-color:#e0674a;color:#fca5a5}";
    document.head.appendChild(st);
}
function css3() {
    if (document.getElementById('sa-css3')) return;
    var st = document.createElement('style'); st.id = 'sa-css3'; st.textContent = "#sa-ui.sa-glass{background:linear-gradient(180deg,rgba(4,7,14,.5),rgba(4,7,14,.86)),url(\"Images/bg/home.png\") center/cover no-repeat fixed!important}\n.sa-glass .sa-head h1{font-size:2.6rem;line-height:1.1;background:linear-gradient(90deg,#c084fc,#38bdf8);-webkit-background-clip:text;background-clip:text;color:transparent}\n.sa-glass .sa-head p{color:#7dd3fc}\n.sa-top3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:12px 0}\n.sa-gl{background:linear-gradient(160deg,rgba(255,255,255,.14),rgba(255,255,255,.04));border:1px solid rgba(255,255,255,.18);border-radius:22px;padding:18px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#fff}\n.sa-gl>small{display:block;letter-spacing:3px;color:#a5b4fc;font-size:.78rem}\n.sa-gl b.big{display:block;font-size:2.8rem;color:#fff;margin-top:4px;font-variant-numeric:tabular-nums}\n.sa-pill{margin-top:8px;padding:8px 16px;border-radius:20px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-weight:700;cursor:pointer;transition:background .2s,transform .2s}.sa-pill:hover{background:rgba(255,255,255,.2);transform:translateY(-1px)}\n.sa-pc{margin-bottom:14px}.sa-pc .h{display:flex;justify-content:space-between;align-items:center;font-size:1.2rem;font-weight:800;margin-bottom:10px}.sa-pc .h span{font-size:.82rem;color:#94a3b8;font-weight:400}\n.sa-pc .row{display:grid;grid-template-columns:auto 1fr auto;gap:20px;align-items:center}\n.sa-pc .side{text-align:center;min-width:110px}.sa-pc .side b.n{display:block;font-size:2.6rem;color:#fff;font-variant-numeric:tabular-nums}.sa-pc .side small{color:#cbd5e1}\n.sa-go{margin-top:12px;padding:16px 38px;border-radius:30px;border:0;font-size:1.15rem;font-weight:900;letter-spacing:2px;color:#fff;background:linear-gradient(90deg,#22c55e,#a3e635);box-shadow:0 0 22px rgba(163,230,53,.45);cursor:pointer;animation:saGlow 2s infinite}\n.sa-ph{width:36px;height:36px;border-radius:50%;object-fit:cover;flex:none;background:#fff;border:2px solid #f0b04a}.sa-ph.xs{width:22px;height:22px}.sa-ph.lg{width:64px;height:64px}\n@media(max-width:800px){.sa-top3{grid-template-columns:1fr}.sa-pc .row{grid-template-columns:1fr}}";
    document.head.appendChild(st);
}
function css() {
    css2(); css3();
    if (document.getElementById('sa-css')) return;
    if (!document.querySelector('link[href*="Yatra"]')) { var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = 'https://fonts.googleapis.com/css2?family=Hind:wght@400;500;600;700&family=Yatra+One&display=swap'; document.head.appendChild(lk); }
    var st = document.createElement('style'); st.id = 'sa-css';
    st.textContent = [
'#sa-ui,#sa-war,#sa-modal{--bg:#0d1a1e;--bg2:#112228;--cd:#162c32;--cd2:#1b363d;--ln:#2a474f;--tx:#ecf1ea;--mu:#8fa8a4;--gold:#f0b04a;--jade:#58c49a;--ver:#e0674a;--ind:#8aa4ff;color:var(--tx);font:400 15px/1.45 Hind,system-ui,-apple-system,"Segoe UI",sans-serif;}',
'#sa-ui *,#sa-war *,#sa-modal *{box-sizing:border-box;}#sa-ui button,#sa-war button,#sa-modal button{font-family:inherit;}',
'#sa-ui,#sa-war{position:fixed;inset:0;z-index:9000;}#sa-ui.hidden,#sa-war.hidden{display:none;}',
'#sa-ui{background:var(--bg);overflow:auto;}',
'.sa-wrap{max-width:1180px;margin:0 auto;padding:16px 18px 60px;}',
'.sa-head{display:flex;align-items:center;gap:14px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--ln);flex-wrap:wrap;}',
'.sa-head h1{margin:0;font:400 26px/1.15 "Yatra One",Hind,serif;}.sa-head p{margin:2px 0 0;color:var(--mu);font-size:13.5px;}',
'.sa-back{border:1px solid var(--ln);background:rgba(0,0,0,.25);color:var(--tx);border-radius:10px;min-width:38px;height:38px;padding:0 14px;cursor:pointer;font-weight:600;}.sa-back:hover{border-color:var(--gold);}',
/* emblem */
'.sa-em{width:46px;height:46px;border-radius:12px;flex:none;display:block;background:#0a1417;}.sa-em.sm{width:36px;height:36px;border-radius:10px;}.sa-em.xs{width:22px;height:22px;border-radius:7px;}.sa-em.lg{width:64px;height:64px;border-radius:16px;}',
/* toolbar */
'.sa-tools{display:grid;gap:10px;background:var(--cd);border:1px solid var(--ln);border-radius:14px;padding:14px;margin-bottom:14px;}',
'.sa-in{width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--ln);background:#0b1518;color:var(--tx);font:inherit;outline:none;}.sa-in:focus{border-color:var(--gold);}',
'.sa-seg{display:flex;gap:6px;flex-wrap:wrap;}.sa-seg button{border:1px solid var(--ln);background:transparent;color:var(--mu);border-radius:20px;padding:5px 14px;font-size:13.5px;cursor:pointer;}.sa-seg button.on{background:var(--gold);border-color:var(--gold);color:#1b1405;font-weight:600;}.sa-seg button:hover{color:var(--tx);}',
/* kadam */
'.sa-cr{display:flex;gap:6px;margin:0 0 14px;overflow-x:auto;}.sa-cr span{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--mu);padding:5px 12px 5px 6px;border-radius:30px;border:1px solid var(--ln);white-space:nowrap;}.sa-cr i{font-style:normal;width:20px;height:20px;border-radius:50%;background:var(--cd2);display:inline-flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:600;}',
'.sa-cr span.on{color:var(--tx);border-color:var(--gold);}.sa-cr span.on i{background:var(--gold);color:#1b1405;}.sa-cr span.done{color:var(--tx);}.sa-cr span.done i{background:var(--jade);color:#07241a;}',
/* state tiles */
'.sa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px;}',
'.sa-tile{position:relative;cursor:pointer;border-radius:16px;padding:14px 14px 13px;background:var(--cd);border:1px solid var(--ln);transition:transform .2s,border-color .2s,background .2s;animation:saIn .4s both;overflow:hidden;}',
'.sa-tile::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:hsl(var(--h),58%,58%);}',
'.sa-tile:hover{transform:translateY(-3px);border-color:hsl(var(--h),58%,58%);background:var(--cd2);}',
'.sa-tmap{background:radial-gradient(circle at 50% 40%,hsla(var(--h),55%,50%,.14),transparent 70%);border-radius:12px;margin-bottom:8px;}.sa-tmap svg{width:100%;height:118px;display:block;}',
'.sa-tile small{display:block;color:var(--mu);font-size:11.5px;letter-spacing:.3px;}.sa-tile h3{margin:1px 0 8px;font:400 19px/1.2 "Yatra One",Hind,serif;}',
'.sa-tmeta{display:flex;gap:14px;font-size:12.5px;color:var(--mu);}.sa-tmeta b{display:block;font:400 21px/1.1 "Yatra One",Hind,serif;color:hsl(var(--h),62%,70%);font-variant-numeric:tabular-nums;}',
'.sa-tile.off{opacity:.45;cursor:not-allowed;}.sa-tile.off:hover{transform:none;border-color:var(--ln);background:var(--cd);}.sa-soon{height:118px;display:flex;align-items:center;justify-content:center;color:var(--mu);font-size:13px;border:1px dashed var(--ln);border-radius:12px;margin-bottom:8px;}',
'.sa-chip{display:inline-block;padding:2px 10px;border-radius:20px;font-size:12px;border:1px solid var(--ln);color:var(--mu);margin:3px 4px 0 0;}.sa-chip.g{color:var(--jade);border-color:rgba(88,196,154,.45);}.sa-chip.r{color:var(--ver);border-color:rgba(224,103,74,.5);}',
/* party card */
'.sa-sec{margin-bottom:16px;}.sa-sec>h3{margin:0 0 10px;font:400 17px/1.2 "Yatra One",Hind,serif;color:var(--gold);}',
'.sa-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;}',
'.sa-card{cursor:pointer;border-radius:16px;padding:14px;background:var(--cd);border:1px solid var(--ln);border-left:5px solid var(--c,#64748b);transition:transform .2s,background .2s,border-color .2s;animation:saIn .4s both;display:flex;gap:14px;align-items:center;}',
'.sa-card:hover{transform:translateY(-3px);background:var(--cd2);border-color:var(--c,#64748b);}.sa-card.sel{border-color:var(--gold);background:rgba(240,176,74,.1);}',
'.sa-card h3{margin:0;font-size:17px;font-weight:600;line-height:1.2;}.sa-card .big{font:400 30px/1.1 "Yatra One",Hind,serif;font-variant-numeric:tabular-nums;}.sa-card small{color:var(--mu);}.sa-card .sa-pl{margin-top:6px;font-size:12.5px;color:#b8cbc8;}',
/* a-z */
'.sa-az{display:flex;flex-wrap:wrap;gap:4px;margin:10px 0;}.sa-az button{border:1px solid var(--ln);background:transparent;color:var(--mu);border-radius:7px;width:28px;height:28px;font-size:12.5px;cursor:pointer;}.sa-az button:hover{color:var(--gold);border-color:var(--gold);}',
'.sa-lh{margin:16px 0 8px;font:400 15px "Yatra One",Hind,serif;color:var(--gold);}',
'.sa-allp{max-height:54vh;overflow:auto;padding-right:4px;}.sa-pcs{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:10px;}',
'.sa-mini{position:relative;display:flex;gap:12px;align-items:center;border:1px solid var(--ln);border-left:4px solid var(--c,#64748b);border-radius:12px;background:var(--bg2);padding:9px 12px;cursor:pointer;transition:background .15s,border-color .15s;}',
'.sa-mini:hover{background:var(--cd2);border-color:var(--c,#64748b);}.sa-mini b{display:block;font-weight:600;line-height:1.2;}.sa-mini small{color:var(--mu);font-size:12.5px;}',
/* panels */
'.sa-panel{background:var(--cd);border:1px solid var(--ln);border-radius:16px;padding:16px;margin-bottom:14px;}.sa-panel h3{margin:0 0 12px;font:400 16px/1.2 "Yatra One",Hind,serif;color:var(--gold);}',
'.sa-btn{border:0;border-radius:10px;padding:11px 20px;font-weight:600;color:#1b1405;cursor:pointer;background:var(--gold);font-size:14.5px;}.sa-btn:hover{filter:brightness(1.08);}',
'.sa-btn.b{background:var(--ind);color:#101640;}.sa-btn.o{background:var(--ver);color:#fff;}.sa-btn.gh{background:transparent;color:var(--tx);border:1px solid var(--ln);}.sa-btn.gh:hover{border-color:var(--mu);}',
'.sa-btn:disabled{opacity:.38;cursor:not-allowed;filter:none;}.sa-btn.sm{padding:6px 12px;font-size:13px;border-radius:8px;}',
'.sa-row{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:8px;border-radius:12px;background:var(--bg2);border:1px solid var(--ln);}',
'.sa-row .t{flex:1;min-width:0;}.sa-row small{color:var(--mu);display:block;font-size:12.5px;}',
'.sa-bar{display:flex;height:16px;border-radius:8px;overflow:hidden;background:#0a1417;margin:8px 0;position:relative;}.sa-bar i{display:block;height:100%;transition:width .4s;}',
'.sa-bar.maj::after{content:"";position:absolute;left:50%;top:-3px;bottom:-3px;width:3px;background:var(--gold);}',
'.sa-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}',
'.sa-chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;}',
'.sa-stat{padding:8px 14px;border-radius:12px;background:var(--bg2);border:1px solid var(--ln);font-size:12.5px;color:var(--mu);}.sa-stat b{display:block;font:400 22px/1.2 "Yatra One",Hind,serif;color:var(--tx);}',
'.sa-msg{background:rgba(138,164,255,.12);border:1px solid rgba(138,164,255,.4);color:#d5ddff;border-radius:10px;padding:8px 12px;margin:8px 0;font-size:13.5px;}.sa-msg.bad{background:rgba(224,103,74,.12);border-color:rgba(224,103,74,.45);color:#ffc9bd;}',
'.sa-verdict{padding:14px 18px;border-radius:14px;font-weight:600;font-size:16px;margin:10px 0;}.sa-verdict.g{background:rgba(88,196,154,.14);color:#8ee3c0;}.sa-verdict.y{background:rgba(240,176,74,.14);color:#f6cf8a;}.sa-verdict.r{background:rgba(224,103,74,.14);color:#ffb4a2;}',
'.sa-stepper{display:flex;align-items:center;gap:8px;}.sa-stepper button{width:30px;height:30px;border-radius:50%;border:1px solid var(--ln);background:var(--cd2);color:var(--tx);font-weight:700;cursor:pointer;}',
'.sa-select{padding:8px 10px;border-radius:8px;background:#0b1518;color:var(--tx);border:1px solid var(--ln);max-width:100%;font:inherit;}',
'.sa-oath{text-align:center;padding:28px 18px;border-radius:20px;background:linear-gradient(160deg,rgba(240,176,74,.16),rgba(255,255,255,.02));border:1px solid rgba(240,176,74,.5);}.sa-oath h2{font:400 30px/1.2 "Yatra One",Hind,serif;margin:6px 0;}',
/* mukabla / gathbandhan */
'.sa-match{display:grid;grid-template-columns:1fr 70px 1fr;gap:12px;align-items:stretch;margin-bottom:16px;}',
'.sa-side2{background:var(--cd);border:1px solid var(--ln);border-radius:18px;padding:16px;position:relative;border-top:5px solid var(--c);}',
'.sa-tag{position:absolute;top:-1px;right:14px;transform:translateY(-50%);background:var(--c);color:#fff;font-weight:700;font-size:12px;padding:3px 12px;border-radius:20px;letter-spacing:.5px;}',
'.sa-lead{display:flex;gap:14px;align-items:center;margin-bottom:12px;}.sa-lead h3{margin:0;font:400 22px/1.15 "Yatra One",Hind,serif;}.sa-lead small{color:var(--mu);display:block;font-size:13px;}',
'.sa-vs{display:flex;align-items:center;justify-content:center;font:400 26px "Yatra One",Hind,serif;color:var(--gold);}.sa-vs span{width:58px;height:58px;border-radius:50%;border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;background:var(--bg2);}',
'.sa-slots{display:grid;grid-template-columns:1fr 1fr;gap:8px;}',
'.sa-slot{display:flex;align-items:center;gap:10px;border:1px solid var(--ln);border-left:4px solid var(--c,#64748b);border-radius:12px;padding:8px 10px;background:var(--bg2);position:relative;min-height:54px;}',
'.sa-slot b{display:block;font-size:14px;line-height:1.2;}.sa-slot small{color:var(--mu);font-size:12px;}',
'.sa-slot.add{border:1px dashed var(--mu);color:var(--mu);justify-content:center;cursor:pointer;font-weight:600;border-left:1px dashed var(--mu);}.sa-slot.add:hover{color:var(--gold);border-color:var(--gold);}',
'.sa-x{position:absolute;top:4px;right:5px;width:20px;height:20px;border-radius:50%;border:0;background:rgba(0,0,0,.35);color:var(--mu);cursor:pointer;font-size:13px;line-height:1;}.sa-x:hover{color:#fff;background:var(--ver);}',
'.sa-note{color:var(--mu);font-size:13.5px;margin:6px 0 0;}',
/* seat sharing */
'.sa-sbar{display:flex;height:22px;border-radius:11px;overflow:hidden;background:#0a1417;margin:10px 0;position:relative;}.sa-sbar i{display:block;height:100%;transition:width .25s;}',
'.sa-shr{display:grid;grid-template-columns:1fr 1.5fr 1fr;gap:12px;align-items:center;margin-bottom:12px;}',
'.sa-sbox{display:flex;gap:10px;align-items:center;border:1px solid var(--ln);border-left:5px solid var(--c);border-radius:14px;background:var(--cd);padding:10px 12px;}.sa-sbox b{display:block;line-height:1.2;}.sa-sbox .n{margin-left:auto;font:400 28px/1 "Yatra One",Hind,serif;font-variant-numeric:tabular-nums;}',
'.sa-slider{background:var(--cd);border:1px solid var(--ln);border-radius:14px;padding:10px 14px;text-align:center;}.sa-slider small{color:var(--mu);font-size:12.5px;}',
'.sa-slider input[type=range]{width:100%;accent-color:#f0b04a;margin:6px 0;}',
'.sa-hint{display:inline-block;font-size:12px;padding:2px 10px;border-radius:20px;border:1px solid var(--ln);color:var(--mu);}.sa-hint.g{color:var(--jade);border-color:rgba(88,196,154,.45);}.sa-hint.r{color:var(--ver);border-color:rgba(224,103,74,.5);}',
/* picker modal */
'#sa-modal{position:fixed;inset:0;z-index:9400;display:flex;align-items:center;justify-content:center;padding:16px;}#sa-modal.hidden{display:none;}.sa-mbd{position:absolute;inset:0;background:rgba(3,10,12,.72);}',
'.sa-mbox{position:relative;width:min(820px,100%);max-height:92vh;display:flex;flex-direction:column;background:var(--bg2);border:1px solid var(--ln);border-radius:18px;padding:16px;}.sa-mbox h2{margin:0 0 10px;font:400 21px/1.2 "Yatra One",Hind,serif;display:flex;justify-content:space-between;align-items:center;}',
'.sa-mscroll{overflow:auto;margin-top:10px;padding-right:4px;}',
/* war room */
'#sa-war{background:var(--bg);display:flex;flex-direction:column;}',
'.sa-top{display:flex;align-items:center;gap:10px;padding:9px 14px;background:var(--bg2);border-bottom:1px solid var(--ln);flex-wrap:wrap;}.sa-top .ttl{font:400 19px/1.1 "Yatra One",Hind,serif;}',
'.sa-top .pill{padding:5px 12px;border-radius:20px;border:1px solid var(--ln);font-size:13px;white-space:nowrap;color:var(--mu);}.sa-top .pill b{color:var(--tx);font-weight:600;}',
'.sa-body{flex:1;display:flex;min-height:0;position:relative;}',
'.sa-side{width:68px;flex:none;overflow-y:auto;background:var(--bg2);padding:6px 4px;border-right:1px solid var(--ln);}.sa-side.r{border-right:0;border-left:1px solid var(--ln);}',
'.sa-ic{width:100%;border:0;background:transparent;color:var(--mu);padding:9px 2px;margin-bottom:2px;border-radius:10px;cursor:pointer;font:500 10.5px/1.15 Hind,sans-serif;display:flex;flex-direction:column;align-items:center;gap:4px;}',
'.sa-ic svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}.sa-ic:hover,.sa-ic.on{background:var(--cd2);color:var(--gold);}',
'.sa-meters{width:96px;flex:none;display:flex;gap:10px;justify-content:center;padding:12px 6px;background:var(--bg2);border-right:1px solid var(--ln);}',
'.sa-m{display:flex;flex-direction:column;align-items:center;font-size:10.5px;font-weight:600;color:var(--mu);width:26px;}.sa-m i{display:block;position:relative;width:14px;flex:1;border-radius:7px;background:#0a1417;overflow:hidden;margin:6px 0;min-height:140px;}.sa-m i u{position:absolute;left:0;right:0;bottom:0;border-radius:7px;transition:height .6s;}.sa-m i.mid::after{content:"";position:absolute;left:0;right:0;top:50%;height:2px;background:rgba(240,176,74,.9);}',
'.sa-m span{writing-mode:vertical-rl;transform:rotate(180deg);}.sa-m b{font-size:12px;color:var(--tx);text-align:center;}',
'.sa-mapwrap{flex:1;position:relative;min-width:0;}#sa-map{position:absolute;inset:0;background:#0a1417;}',
'.sa-legend{position:absolute;left:10px;bottom:10px;z-index:500;background:rgba(17,34,40,.92);border:1px solid var(--ln);border-radius:12px;padding:8px 10px;font-size:12px;max-width:240px;}',
'.sa-legend span{display:inline-flex;align-items:center;gap:4px;margin:2px 8px 2px 0;}.sa-legend i{width:10px;height:10px;border-radius:50%;display:inline-block;}',
'.sa-divs{position:absolute;top:8px;left:10px;right:10px;z-index:500;display:flex;gap:6px;flex-wrap:wrap;pointer-events:none;}',
'.sa-divs button{pointer-events:auto;border:1px solid var(--ln);background:rgba(17,34,40,.92);color:var(--tx);border-radius:20px;padding:4px 12px;font-size:12.5px;cursor:pointer;}.sa-divs button.on{background:var(--gold);border-color:var(--gold);color:#1b1405;font-weight:600;}',
'.sa-seatcard{position:absolute;right:10px;top:46px;z-index:600;width:285px;background:rgba(17,34,40,.96);border:1px solid var(--ln);border-top:4px solid var(--gold);border-radius:14px;padding:12px 14px;font-size:13px;box-shadow:0 12px 30px rgba(0,0,0,.45);}',
'.sa-body.dr .sa-seatcard{right:calc(min(430px,92vw) + 10px);}',
'.sa-seatcard h4{margin:0 0 2px;font:400 17px/1.2 "Yatra One",Hind,serif;}.sa-seatcard .q{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}',
'.sa-drawer{position:absolute;top:0;bottom:0;width:min(430px,92vw);z-index:700;background:rgba(13,26,30,.985);overflow-y:auto;padding:14px;box-shadow:0 0 40px rgba(0,0,0,.55);}.sa-drawer.hidden{display:none;}',
'.sa-drawer.l{left:164px;border-right:1px solid var(--ln);}.sa-drawer.r{right:68px;border-left:1px solid var(--ln);}',
'.sa-drawer h2{margin:0 0 4px;font:400 20px/1.2 "Yatra One",Hind,serif;}.sa-drawer .sub{color:var(--mu);font-size:13px;margin-bottom:10px;}',
/* neeche ke 4 box */
'.sa-bottom{display:grid;grid-template-columns:1fr 1fr 1fr 1.5fr;gap:12px;padding:12px 14px;background:var(--bg2);border-top:1px solid var(--ln);}',
'.sa-bx{position:relative;border:1px solid var(--ln);border-top:4px solid var(--c,#64748b);border-radius:14px;background:var(--cd);padding:11px 15px;min-height:150px;overflow:hidden;}',
'.sa-bh{display:flex;align-items:center;gap:9px;font-size:12.5px;color:var(--mu);margin-bottom:6px;}.sa-bh b{color:var(--tx);font-weight:600;font-size:13.5px;}',
'.sa-live{margin-left:auto;display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:#ffb4a2;}.sa-live i{width:7px;height:7px;border-radius:50%;background:var(--ver);animation:salp 1.6s infinite;}',
'@keyframes salp{0%{box-shadow:0 0 0 0 rgba(224,103,74,.6);}70%{box-shadow:0 0 0 7px rgba(224,103,74,0);}100%{box-shadow:0 0 0 0 rgba(224,103,74,0);}}',
'.sa-nums{display:flex;gap:22px;align-items:flex-end;}.sa-nums div{font:400 36px/1 "Yatra One",Hind,serif;font-variant-numeric:tabular-nums;}.sa-nums small{display:block;font:500 12px Hind,sans-serif;color:var(--mu);margin-top:4px;}',
'.sa-pr{height:8px;border-radius:4px;background:#0a1417;overflow:hidden;margin:10px 0 8px;position:relative;}.sa-pr i{display:block;height:100%;transition:width .5s;}.sa-pr u{position:absolute;top:-2px;bottom:-2px;width:2px;background:var(--gold);}',
'.sa-lv{font-size:14px;line-height:1.35;min-height:38px;}.sa-lv>div{animation:saIn .5s ease;}.sa-lv em{font-style:normal;color:var(--gold);font-weight:600;}',
'.sa-hl{font-size:15.5px;font-weight:600;line-height:1.35;min-height:44px;animation:saIn .5s ease;}',
'.sa-mq{margin-top:9px;overflow:hidden;white-space:nowrap;border-top:1px solid var(--ln);padding-top:8px;color:var(--mu);font-size:13px;}.sa-mq span{display:inline-block;padding-left:100%;animation:samq 32s linear infinite;}',
'@keyframes samq{from{transform:translateX(0);}to{transform:translateX(-100%);}}',
'@keyframes saIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
'@media(max-width:1000px){.sa-bottom{grid-template-columns:1fr 1fr;}.sa-match{grid-template-columns:1fr;}.sa-vs{padding:4px 0;}.sa-shr{grid-template-columns:1fr;}}',
'@media(max-width:900px){.sa-grid2{grid-template-columns:1fr;}.sa-seatcard{width:225px;}.sa-side{width:54px;}.sa-ic{font-size:9.5px;}.sa-meters{width:78px;gap:6px;}.sa-drawer.l{left:132px;}.sa-drawer.r{right:54px;}.sa-bottom{max-height:38vh;overflow:auto;}.sa-head h1{font-size:21px;}.sa-slots{grid-template-columns:1fr;}}',
'@media(prefers-reduced-motion:reduce){.sa-lv,.sa-hl,.sa-mq span,.sa-live i,.sa-tile,.sa-card{animation:none;}}'
    ].join('\n');
    document.head.appendChild(st);
}
function uiEl() { var el = document.getElementById('sa-ui'); if (!el) { el = document.createElement('div'); el.id = 'sa-ui'; el.className = 'hidden'; document.body.appendChild(el); } return el; }
function warEl() { var el = document.getElementById('sa-war'); if (!el) { el = document.createElement('div'); el.id = 'sa-war'; el.className = 'hidden'; document.body.appendChild(el); } return el; }
function showUi(title, sub, body, backFn) {
    var el = uiEl(); el.classList.remove('sa-glass');
    el.innerHTML = '<div class="sa-wrap"><div class="sa-head"><button class="sa-back" onclick="' + (backFn || 'SAC.close()') + '">&larr; Wapas</button><div><h1>' + E(title) + '</h1><p>' + E(sub || '') + '</p></div></div>' + body + '</div>';
    el.classList.remove('hidden'); el.scrollTop = 0;
    warEl().classList.add('hidden');
}
function hist() { try { return JSON.parse(localStorage.getItem(SA_HIST)) || {}; } catch (e) { return {}; } }
function histSave(state, rec) { var h = hist(); h[state] = rec; try { localStorage.setItem(SA_HIST, JSON.stringify(h)); } catch (e) {} }

// ---------- state list ----------
var REGION = { 'Jammu & Kashmir': 'Uttar', 'Himachal Pradesh': 'Uttar', 'Punjab': 'Uttar', 'Haryana': 'Uttar', 'Delhi': 'Uttar', 'Uttarakhand': 'Uttar', 'Uttar Pradesh': 'Uttar', 'Rajasthan': 'Pashchim', 'Gujarat': 'Pashchim', 'Maharashtra': 'Pashchim', 'Goa': 'Pashchim', 'Madhya Pradesh': 'Madhya', 'Chhattisgarh': 'Madhya', 'Bihar': 'Purv', 'Jharkhand': 'Purv', 'Odisha': 'Purv', 'West Bengal': 'Purv', 'Andhra Pradesh': 'Dakshin', 'Telangana': 'Dakshin', 'Karnataka': 'Dakshin', 'Kerala': 'Dakshin', 'Tamil Nadu': 'Dakshin', 'Puducherry': 'Dakshin', 'Assam': 'Poorvottar', 'Arunachal Pradesh': 'Poorvottar', 'Manipur': 'Poorvottar', 'Meghalaya': 'Poorvottar', 'Mizoram': 'Poorvottar', 'Nagaland': 'Poorvottar', 'Sikkim': 'Poorvottar', 'Tripura': 'Poorvottar' };
var REGION_NAME = { Uttar: 'Uttar Bharat', Dakshin: 'Dakshin Bharat', Purv: 'Purvi Bharat', Pashchim: 'Pashchim Bharat', Madhya: 'Madhya Bharat', Poorvottar: 'Poorvottar' };
function em(name, cls) {
    var sz = cls === 'xs' ? 22 : (cls === 'sm' ? 36 : (cls === 'lg' ? 64 : 50));
    if (typeof s22Logo === 'function' && name && name !== 'Others') return '<span class="sa-emw ' + (cls || '') + '" style="width:' + sz + 'px;height:' + sz + 'px">' + s22Logo(name, sz) + '</span>';
    var u = window.PartyUI; return '<img class="sa-em ' + (cls || '') + '" src="' + (u ? u.emblem(name, name ? colOf(name) : null) : '') + '" alt="">';
}
function leaderImg(n, p, cls) {
    var ph = window.CareerMode && CareerMode.photoFor && CareerMode.photoFor(n);
    if (ph) return '<img class="sa-ph ' + (cls || '') + '" src="' + ph + '" alt="">';
    return em(p, cls);
}
function crumbs(i) {
    var steps = ['State', 'Party', 'Mukabla', 'Seat sharing'];
    return '<div class="sa-cr">' + steps.map(function (t, k) { return '<span class="' + (k < i ? 'done' : (k === i ? 'on' : '')) + '"><i>' + (k < i ? '&#10003;' : (k + 1)) + '</i>' + t + '</span>'; }).join('') + '</div>';
}
var THUMBS = {};
function thumb(name, hue) {
    var ck = name + hue; if (THUMBS[ck]) return THUMBS[ck];
    var fc = assemblyData[name], minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9, paths = [];
    fc.features.forEach(function (f) {
        var ps = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
        var ring = ps[0][0]; ps.forEach(function (p) { if (p[0].length > ring.length) ring = p[0]; });
        var step = Math.max(1, Math.ceil(ring.length / 10)), pts = [];
        for (var i = 0; i < ring.length; i += step) pts.push(ring[i]);
        pts.forEach(function (p) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); });
        paths.push(pts);
    });
    var w = maxx - minx, h = maxy - miny, sc = Math.min(180 / w, 100 / h), ox = (200 - w * sc) / 2, oy = (110 - h * sc) / 2;
    var d = paths.map(function (pts) { return 'M' + pts.map(function (p) { return ((p[0] - minx) * sc + ox).toFixed(1) + ',' + ((maxy - p[1]) * sc + oy).toFixed(1); }).join('L') + 'Z'; }).join('');
    return (THUMBS[ck] = '<svg viewBox="0 0 200 110"><path d="' + d + '" fill="hsla(' + hue + ',60%,58%,.42)" stroke="hsla(' + hue + ',60%,78%,.9)" stroke-width=".6" stroke-linejoin="round"/></svg>');
}
function stateTiles() {
    var have = availableStates(), all = Object.keys(SA_DATA).sort(), h = hist(), q = (SA.sq || '').toLowerCase(), rg = SA.reg || '';
    all = all.filter(function (n) { return (!q || n.toLowerCase().indexOf(q) >= 0) && (!rg || REGION[n] === rg); });
    if (!all.length) return '<div style="color:var(--mu);padding:18px 4px">Is naam ka koi state nahi mila.</div>';
    return all.map(function (n, i) {
        var ok = have.indexOf(n) >= 0, nseat = ok ? assemblyData[n].features.length : 0, last = h[n], hue = hash(n) % 360, ph = ok ? clamp(Math.ceil(nseat / 70), 1, 7) : 0;
        return '<div class="sa-tile' + (ok ? '' : ' off') + '" style="--h:' + hue + ';animation-delay:' + (Math.min(i, 20) * 0.025) + 's" onclick="SAC.pickState(\'' + Q(n) + '\')"><div class="sa-tmap">' + (ok ? thumb(n, hue) : '<div class="sa-soon">Map file baaki</div>') + '</div>' +
            '<small>' + (REGION[n] ? REGION_NAME[REGION[n]] : 'Rajya') + '</small><h3>' + E(n) + '</h3>' +
            (ok ? '<div class="sa-tmeta"><div><b>' + nseat + '</b>seat</div><div><b>' + ph + '</b>phase</div><div><b>' + (Math.floor(nseat / 2) + 1) + '</b>bahumat</div></div>' : '<div class="sa-tmeta">File aate hi chalu</div>') +
            (last ? '<span class="sa-chip ' + (last.res === 'win' ? 'g' : 'r') + '">Pichhli baar: ' + (last.res === 'win' ? 'Sarkar' : 'Haar') + ' (' + last.seats + ')</span>' : '') + '</div>';
    }).join('');
}
function openList() {
    css();
    var sv = loadSave(), regs = [['', 'Sab']].concat(Object.keys(REGION_NAME).map(function (k) { return [k, REGION_NAME[k]]; }));
    var resume = (sv && sv.G && assemblyData[sv.G.state]) ? '<div class="sa-panel" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><div style="flex:1"><b>Adhura game mila:</b> ' + E(sv.G.state) + ' | ' + E(sv.G.you.main) + ' | Phase ' + (sv.G.phase + 1) + '</div><button class="sa-btn sm" onclick="SAC.resume()">&#9654; Jaari rakho</button><button class="sa-btn gh sm" onclick="SAC.dropSave()">Hatao</button></div>' : '';
    var tools = '<div class="sa-tools"><input class="sa-in" id="sa-sq" placeholder="State ka naam dhoondho..." value="' + E(SA.sq || '') + '" oninput="SAC.stq(this.value)"><div class="sa-seg">' + regs.map(function (r) { return '<button class="' + ((SA.reg || '') === r[0] ? 'on' : '') + '" onclick="SAC.strg(\'' + r[0] + '\')">' + r[1] + '</button>'; }).join('') + '</div></div>';
    showUi('State Assembly Election', 'Wo rajya chuno jahan chunav ladna hai. Seat, phase aur dal sab us rajya ke hisaab se.', resume + tools + '<div class="sa-grid" id="sa-stg">' + stateTiles() + '</div>');
}
function stq(v) { SA.sq = v; var e = document.getElementById('sa-stg'); if (e) e.innerHTML = stateTiles(); }
function strg(r) { SA.reg = r; openList(); }

// =============================================================
//  SETUP: party -> rival/alliance -> seat sharing
// =============================================================
function blocOfAll(n) { var b = 'oth'; Object.keys(SA_DATA).forEach(function (s) { SA_DATA[s].parties.forEach(function (p) { if (p[0] === n && b === 'oth') b = p[2]; }); }); return b; }
function addExtra(x) {
    if (ST.parties.some(function (p) { return p.n === x.n; })) return;
    var oth = ST.parties.filter(function (p) { return p.n === 'Others'; })[0];
    ST.parties.push({ n: x.n, s: x.s, b: x.b }); if (oth) oth.s = Math.max(0.5, Math.round((oth.s - x.s) * 10) / 10); BASE = {};
}
function ensureParty(n) {
    if (!ST || !n || ST.parties.some(function (x) { return x.n === n; })) return;
    var x = { n: n, s: 2.5, b: blocOfAll(n) }; addExtra(x); SA.ui.extra = SA.ui.extra || []; SA.ui.extra.push(x);
}
function pickState(n) {
    if (availableStates().indexOf(n) < 0) { alert(n + ' ki map file abhi nahi mili. Jaise hi file aayegi ye chalu ho jayega.'); return; }
    ST = loadState(n); SA.ui = { diff: 'Normal', mode: 'alone', partners: [], extra: [], oppAllies: null };
    partyScreen();
}
function allNames() { var ex = ST ? ST.parties.map(function (p) { return p.n; }).filter(function (n) { return n !== 'Others'; }) : []; return window.PartyUI ? PartyUI.allParties(ex) : ex; }
function shareMaybe(p) { var x = ST.parties.filter(function (q) { return q.n === p; })[0]; return x ? x.s : null; }
function azList() {
    var a = SA.az, q = (a.q || '').toLowerCase(), cur = '', h = '';
    allNames().filter(function (p) { return a.ex.indexOf(p) < 0 && (!q || p.toLowerCase().indexOf(q) >= 0); }).forEach(function (p) {
        var L = p.charAt(0).toUpperCase(); if (L !== cur) { if (cur) h += '</div>'; cur = L; h += '<div class="sa-lh" id="sa-L-' + L + '">' + L + '</div><div class="sa-pcs">'; }
        var sh = shareMaybe(p);
        h += '<div class="sa-mini" style="--c:' + colOf(p) + '" onclick="SAC.' + a.fn + '(\'' + Q(p) + '\')">' + em(p) + '<div><b>' + E(p) + '</b><small>' + (sh != null ? sh + '% vote' : 'Is rajya mein chhoti party') + '</small></div></div>';
    });
    return cur ? h + '</div>' : '<div style="color:var(--mu);padding:12px 0">Is naam ki koi party nahi mili.</div>';
}
function azBox() {
    var a = SA.az, letters = {}; allNames().forEach(function (p) { if (a.ex.indexOf(p) < 0) letters[p.charAt(0).toUpperCase()] = 1; });
    return '<input class="sa-in" placeholder="Party ka naam dhoondho..." oninput="SAC.azq(this.value)"><div class="sa-az">' + Object.keys(letters).sort().map(function (L) { return '<button onclick="var e=document.getElementById(\'sa-L-' + L + '\');if(e)e.scrollIntoView({behavior:\'smooth\',block:\'start\'})">' + L + '</button>'; }).join('') + '</div><div class="sa-allp" id="sa-allp">' + azList() + '</div>';
}
function azq(v) { SA.az.q = v; var e = document.getElementById('sa-allp'); if (e) e.innerHTML = azList(); }
function partyScreen() {
    var main = ST.parties.filter(function (p) { return p.n !== 'Others'; }).sort(function (a, b) { return b.s - a.s; });
    var cards = main.map(function (p, i) {
        return '<div class="sa-card" style="--c:' + colOf(p.n) + ';animation-delay:' + (i * 0.04) + 's" onclick="SAC.pickParty(\'' + Q(p.n) + '\')">' + em(p.n, 'lg') + '<div><h3>' + E(p.n) + '</h3><div class="big" style="color:' + colOf(p.n) + '">' + p.s + '%</div><small>pichhla vote share</small>' +
            '<div style="margin-top:4px">' + (p.n === ST.data.gov ? '<span class="sa-chip g">Maujooda sarkar</span>' : '') + '<span class="sa-chip">' + BLOC_NAME[p.b] + '</span></div><div class="sa-pl">Neta: ' + E(leadersOf(p.n).slice(0, 2).join(', ')) + '</div></div></div>';
    }).join('');
    SA.az = { fn: 'pickParty', ex: [], q: '' };
    showUi(ST.name + ': Party chuno', ST.n + ' seat | bahumat ' + ST.maj + ' | ' + ST.phases.length + ' phase',
        crumbs(1) + '<div class="sa-sec"><h3>' + E(ST.name) + ' ki pramukh partiyan</h3><div class="sa-cards">' + cards + '</div></div><div class="sa-panel"><h3>Anya partiyan, A se Z</h3>' + azBox() + '</div>', 'SAC.list()');
}
function pickParty(p) {
    ensureParty(p); SA.ui.you = p;
    var rivals = ST.parties.filter(function (q) { return q.n !== p && q.n !== 'Others'; }).sort(function (a, b) { return b.s - a.s; });
    var pb = partyBloc(p), best = rivals.filter(function (q) { return pb === 'oth' || q.b !== pb; })[0] || rivals[0];
    SA.ui.opp = best ? best.n : null;
    SA.ui.partners = SA.ui.mode === 'alliance' ? defaultPartners() : [];
    SA.ui.oppAllies = null;
    modeScreen();
}
function defaultPartners() {
    var you = SA.ui.you, b = partyBloc(you);
    if (b === 'oth') return [];
    return ST.parties.filter(function (q) { return q.n !== you && q.n !== SA.ui.opp && q.n !== 'Others' && q.b === b; }).map(function (q) { return q.n; });
}
function oppAlliesFor(you, partners, opp) {
    var b = partyBloc(opp);
    if (b === 'oth') return [];
    return ST.parties.filter(function (q) { return q.n !== opp && q.n !== 'Others' && q.n !== you && partners.indexOf(q.n) < 0 && q.b === b; }).map(function (q) { return q.n; });
}
function slotHtml(p, rm) {
    return '<div class="sa-slot" style="--c:' + colOf(p) + '">' + em(p, 'sm') + '<div><b>' + E(p) + '</b><small>' + partyShare(p) + '% vote</small></div><button class="sa-x" onclick="' + rm + '" title="Hatao">&times;</button></div>';
}
function modeScreen() {
    var u = SA.ui; if (!u.oppAllies) u.oppAllies = oppAlliesFor(u.you, u.partners, u.opp);
    u.oppAllies = u.oppAllies.filter(function (p) { return p !== u.you && p !== u.opp && u.partners.indexOf(p) < 0; });
    var yc = colOf(u.you), oc = colOf(u.opp), alli = u.mode === 'alliance';
    var yslots = '';
    if (alli) {
        u.partners.forEach(function (p) { yslots += slotHtml(p, 'SAC.rmAlly(\'' + Q(p) + '\')'); });
        if (u.partners.length < 6) yslots += '<div class="sa-slot add" onclick="SAC.pk(\'ally\')">+ Saathi jodo</div>';
    }
    var oslots = u.oppAllies.map(function (p) { return slotHtml(p, 'SAC.rmOppAlly(\'' + Q(p) + '\')'); }).join('') + (u.oppAllies.length < 6 ? '<div class="sa-slot add" onclick="SAC.pk(\'oppAlly\')">+ Saathi jodo</div>' : '');
    var seg = function (items, cur, fn) { return '<div class="sa-seg">' + items.map(function (i) { return '<button class="' + (i[0] === cur ? 'on' : '') + '" onclick="SAC.' + fn + '(\'' + i[0] + '\')">' + i[1] + '</button>'; }).join('') + '</div>'; };
    var controls = '<div class="sa-tools" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))"><div><div class="sa-note" style="margin:0 0 6px">Kaise ladoge?</div>' + seg([['alone', 'Akele'], ['alliance', 'Gathbandhan']], u.mode, 'setMode') + '</div><div><div class="sa-note" style="margin:0 0 6px">Khel ki kathinai</div>' + seg(Object.keys(DIFF).map(function (k) { return [k, DIFF[k].name]; }), u.diff, 'setDiff') + '</div></div>';
    var youBox = '<div class="sa-side2" style="--c:' + yc + '"><span class="sa-tag">AAP</span><div class="sa-lead">' + em(u.you, 'lg') + '<div><h3>' + E(u.you) + '</h3><small>' + partyShare(u.you) + '% vote | ' + BLOC_NAME[partyBloc(u.you)] + '</small></div></div>' +
        (alli ? '<div class="sa-note" style="margin:0 0 8px">Gathbandhan ke saathi</div><div class="sa-slots">' + yslots + '</div>' : '<p class="sa-note">Akele ladoge. Sabhi ' + ST.n + ' seat par aap hi ummeedwar utaroge. Koi seat sharing nahi, par bahumat ke liye akele dum par jeetna padega.</p>') + '</div>';
    var oppBox = '<div class="sa-side2" style="--c:' + oc + '"><span class="sa-tag" style="background:' + oc + '">RIVAL</span><div class="sa-lead">' + em(u.opp, 'lg') + '<div><h3>' + E(u.opp) + '</h3><small>' + partyShare(u.opp) + '% vote | ' + BLOC_NAME[partyBloc(u.opp)] + '</small><button class="sa-btn gh sm" style="margin-top:6px" onclick="SAC.pk(\'opp\')">Rival badlo</button></div></div>' +
        '<div class="sa-note" style="margin:0 0 8px">Rival ke saathi</div><div class="sa-slots">' + oslots + '</div></div>';
    var cta = '<div class="sa-panel" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap"><div style="flex:1;min-width:220px;color:var(--mu);font-size:14px">Aap: <b style="color:var(--tx)">' + E(u.you) + '</b> | Rival: <b style="color:var(--tx)">' + E(u.opp) + '</b>' + (alli ? ' | Saathi: ' + (u.partners.length ? E(u.partners.join(', ')) : 'koi nahi') : '') + '</div><button class="sa-btn" onclick="SAC.afterMode()">' + (alli && u.partners.length ? 'SEAT SHARING &rarr;' : 'CHUNAV SHURU KARO') + '</button></div>';
    showUi(ST.name + ': Mukabla aur Gathbandhan', 'Rival chuno, akele ladna hai ya gathbandhan mein, aur khel ki kathinai.', crumbs(2) + controls + '<div class="sa-match">' + youBox + '<div class="sa-vs"><span>V/S</span></div>' + oppBox + '</div>' + cta, 'SAC.partyScreen()');
}
// ---- party picker (rival / saathi) ----
function pkEl() { var el = document.getElementById('sa-modal'); if (!el) { el = document.createElement('div'); el.id = 'sa-modal'; el.className = 'hidden'; document.body.appendChild(el); } return el; }
function openPicker(role) {
    css(); var u = SA.ui; SA.pk = { role: role };
    var ex = role === 'opp' ? [u.you].concat(u.partners) : [u.you, u.opp].concat(u.partners, u.oppAllies || []);
    SA.az = { fn: 'pkPick', ex: ex, q: '' };
    var titles = { opp: 'Rival chuno', ally: 'Gathbandhan ka saathi chuno', oppAlly: 'Rival ka saathi chuno' };
    var main = ST.parties.filter(function (p) { return p.n !== 'Others' && ex.indexOf(p.n) < 0; }).sort(function (a, b) { return b.s - a.s; });
    var cards = main.map(function (p) { return '<div class="sa-mini" style="--c:' + colOf(p.n) + '" onclick="SAC.pkPick(\'' + Q(p.n) + '\')">' + em(p.n) + '<div><b>' + E(p.n) + '</b><small>' + p.s + '% | ' + BLOC_NAME[p.b] + '</small></div></div>'; }).join('');
    var el = pkEl();
    el.innerHTML = '<div class="sa-mbd" onclick="SAC.pkClose()"></div><div class="sa-mbox"><h2>' + titles[role] + '<button class="sa-back" onclick="SAC.pkClose()">&times;</button></h2><div class="sa-mscroll">' +
        (cards ? '<div class="sa-sec"><h3>' + E(ST.name) + ' ki pramukh partiyan</h3><div class="sa-pcs">' + cards + '</div></div>' : '') + '<div class="sa-sec"><h3>Anya partiyan, A se Z</h3>' + azBox() + '</div></div></div>';
    el.classList.remove('hidden');
}
function pkClose() { pkEl().classList.add('hidden'); }
function pkPick(name) {
    ensureParty(name); var u = SA.ui, r = SA.pk ? SA.pk.role : '';
    if (r === 'opp') { u.opp = name; u.partners = u.partners.filter(function (p) { return p !== name; }); u.oppAllies = null; }
    else if (r === 'ally') { if (u.partners.indexOf(name) < 0) u.partners.push(name); u.oppAllies = (u.oppAllies || []).filter(function (p) { return p !== name; }); }
    else if (r === 'oppAlly') { u.oppAllies = u.oppAllies || []; if (u.oppAllies.indexOf(name) < 0) u.oppAllies.push(name); }
    pkClose(); modeScreen();
}
function afterMode() {
    var u = SA.ui;
    if (u.mode === 'alliance' && u.partners.length) { u.quotas = defaultQuotas([u.you].concat(u.partners), u.you); seatShareScreen(); }
    else { u.partners = []; startWar(); }
}
// ---- seat sharing ----
function maxQuota(p) {
    var u = SA.ui, others = 0; u.partners.forEach(function (x) { if (x !== p) others += (u.quotas[x] || 0); });
    return Math.max(0, ST.n - Math.max(1, Math.round(ST.n * 0.3)) - others);
}
function seatShareScreen() {
    var u = SA.ui, camp = [u.you].concat(u.partners), yc = colOf(u.you);
    var cards = u.partners.map(function (p, i) {
        return '<div class="sa-gl sa-pc" style="animation:saFadeUp .5s ease both;animation-delay:' + (i * 0.08) + 's"><div class="h"><b>' + E(p) + '</b><span>' + partyShare(p) + '% vote | Kul ' + ST.n + ' seats</span></div>' +
            '<div class="row"><div class="side" style="--c:' + yc + '">' + em(u.you, 'lg') + '<b class="n ycnt">0</b><small>' + E(u.you) + '</small></div>' +
            '<div class="sa-slider"><small>' + E(p) + ' ko kitni seat?</small><input type="range" min="0" max="' + ST.n + '" value="' + (u.quotas[p] || 0) + '" id="sa-rg-' + i + '" oninput="SAC.qset(' + i + ',this.value)"><div id="sa-hint-' + i + '"></div><div class="qk"><button class="sa-pill" onclick="SAC.qadd(' + i + ',-10)">-10</button><button class="sa-pill" onclick="SAC.qfair(' + i + ')">Sahi batwara</button><button class="sa-pill" onclick="SAC.qadd(' + i + ',10)">+10</button></div></div>' +
            '<div class="side" style="--c:' + colOf(p) + '">' + em(p, 'lg') + '<b class="n" id="sa-ac-' + i + '">0</b><small>Saathi dal</small></div></div></div>';
    }).join('');
    var legend = camp.map(function (p, i) { return '<span class="sa-chip" style="border-left:4px solid ' + colOf(p) + '">' + E(p) + ': <b id="sa-lg-' + i + '">0</b></span>'; }).join('');
    var body = '<div class="sa-top3"><div class="sa-gl"><small>' + E(u.you.toUpperCase()) + ' KE PAAS</small><b class="big ycnt">0</b></div><div class="sa-gl"><small>SAATHI DALON KE PAAS</small><b class="big" id="sa-allytot">0</b></div><div class="sa-gl"><small>KUL SEATS (' + E(ST.name.toUpperCase()) + ')</small><b class="big">' + ST.n + '</b><button class="sa-pill" onclick="SAC.quotaAuto()">Sahi batwara (auto)</button></div></div>' +
        '<div class="sa-gl" style="margin-bottom:14px"><div class="sa-sbar" id="sa-sbar"></div><div class="sa-chips">' + legend + '</div><p class="sa-note">Slider khiskao. Saathi dal ko uski taqat se zyada seat doge to kamzor seat par aapke vote 15% kam transfer honge, isliye ladane layak seat dena zaroori hai.</p></div>' +
        cards + '<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><button class="sa-pill" onclick="SAC.modeScreen()">&larr; Wapas</button><button class="sa-go" onclick="SAC.start()">LET\'S GO TO FIGHT !</button></div>';
    showUi('Seat Sharing', 'Saathi dalon ko kitni seats deni hain, slider se tay karo.', body, 'SAC.modeScreen()');
    uiEl().classList.add('sa-glass');
    updateShare();
}
function updateShare() {
    var u = SA.ui, camp = [u.you].concat(u.partners), used = 0, fair = defaultQuotas(camp, u.you);
    u.partners.forEach(function (p) { used += u.quotas[p] || 0; });
    var you = ST.n - used, cnt = function (p) { return p === u.you ? you : (u.quotas[p] || 0); };
    var bar = document.getElementById('sa-sbar'); if (bar) bar.innerHTML = camp.map(function (p) { return '<i style="width:' + (cnt(p) / ST.n * 100).toFixed(1) + '%;background:' + colOf(p) + '"><b>' + cnt(p) + '</b></i>'; }).join('');
    camp.forEach(function (p, i) { var e = document.getElementById('sa-lg-' + i); if (e) e.textContent = cnt(p); });
    [].forEach.call(document.querySelectorAll('.ycnt'), function (e) { e.textContent = you; });
    var at = document.getElementById('sa-allytot'); if (at) at.textContent = used;
    u.partners.forEach(function (p, i) {
        var q = u.quotas[p] || 0, f = fair[p] || 1, rg = document.getElementById('sa-rg-' + i), a = document.getElementById('sa-ac-' + i), h = document.getElementById('sa-hint-' + i);
        if (rg) { rg.max = maxQuota(p); rg.value = q; } if (a) a.textContent = q;
        if (h) h.innerHTML = q > f * 1.25 + 2 ? '<span class="sa-hint r">Taqat se zyada maang (sahi ~' + f + ')</span>' : (q < f * 0.75 - 1 ? '<span class="sa-hint">Kam seat (sahi ~' + f + '), aap zyada ladoge</span>' : '<span class="sa-hint g">Sahi batwara (~' + f + ')</span>');
    });
}
function qset(i, v) { var u = SA.ui, p = u.partners[i]; if (!p) return; u.quotas[p] = clamp(parseInt(v, 10) || 0, 0, maxQuota(p)); updateShare(); }


function startWar() {
    var u = SA.ui;
    var oppAll = u.oppAllies ? u.oppAllies.slice() : oppAlliesFor(u.you, u.partners, u.opp);
    newGame({ you: u.you, opp: u.opp, allies: u.partners || [], oppAllies: oppAll, diff: u.diff, quotas: u.quotas }); G.extra = (u.extra || []).slice();
    SA.sel = ST.phases[0][0]; SA.selDiv = ST.byNo[SA.sel].div; SA.panel = null; SA.msg = '';
    saveGame();
    buildWar();
}

// =============================================================
//  WAR ROOM
// =============================================================
function buildWar() {
    css();
    var el = warEl();
    el.innerHTML = '<div class="sa-top" id="sa-top"></div><div class="sa-body" id="sa-bodyw"><div class="sa-side" id="sa-sl"></div><div class="sa-meters" id="sa-meters"></div><div class="sa-mapwrap"><div id="sa-map"></div><div class="sa-divs" id="sa-divs"></div><div class="sa-legend" id="sa-legend"></div><div class="sa-seatcard" id="sa-seatcard" style="display:none"></div></div><div class="sa-side r" id="sa-sr"></div><div class="sa-drawer hidden" id="sa-drawer"></div></div><div class="sa-bottom" id="sa-bottom"></div>';
    uiEl().classList.add('hidden'); el.classList.remove('hidden');
    SA.tk = 0; SA.nsig = '';
    buildSide(); initMap(); refreshWar(); startTicker();
}
var SVGI = {
    'Rally': 'M4 10v4h3l7 4V6L7 10H4zM17 9a4 4 0 0 1 0 6',
    'Local Guru': 'M12 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 21c0-4 3-7 7-7s7 3 7 7',
    'Karyakarta': 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 10a2.5 2.5 0 1 0 0-5M16 14.2c3 .3 5 2.4 5 5.8',
    'IT & Media': 'M5 9h14M5 15h14M10 4L8 20M16 4l-2 16',
    'Manifesto': 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
    'Controversy': 'M13 2L4 14h7l-1 8 9-12h-7z',
    'DM/SP': 'M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18',
    'Dalbadlu': 'M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4',
    'Funds': 'M12 3v18M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 3 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3',
    'CM Face': 'M3 18l2-10 5 5 2-7 2 7 5-5 2 10zM3 21h18',
    'Survey': 'M4 20V10M10 20V4M16 20v-8M22 20H2',
    'Court': 'M12 3v17M5 7h14M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0zM8 21h8',
    'EC': 'M12 2l9 4v6c0 5-4 8-9 10-5-2-9-5-9-10V6zM9 12l2 2 4-4',
    'Spy': 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    'VIP': 'M12 2l3 6.2 6.8 1-4.9 4.8 1.2 6.8L12 17.6 5.9 20.8l1.2-6.8L2.2 9.2 9 8.2z',
    'Aaram': 'M3 8h15v8H3zM18 11h3v2h-3zM6 10.5v3M9 10.5v3M12 10.5v3',
    'Seats': 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
    'Bahar': 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'
};
var ICON_L = [['Rally', 'Rally'], ['Local Guru', 'Guru'], ['Karyakarta', 'Karyakarta'], ['IT & Media', 'IT/Media'], ['Manifesto', 'Ghoshna'], ['Controversy', 'Controversy'], ['Court', 'Court'], ['EC', 'EC (MCC)']];
var ICON_R = [['Survey', 'Survey'], ['DM/SP', 'DM/SP'], ['Dalbadlu', 'Dalbadlu'], ['Funds', 'Funds'], ['CM Face', 'CM Chehra'], ['VIP', 'VIP Seat'], ['Spy', 'Spy'], ['Aaram', 'Stamina'], ['Seats', 'Seat List']];
function sideBtn(x) { return '<button class="sa-ic" data-p="' + x[0] + '" onclick="SAC.panel(\'' + x[0] + '\')"><svg viewBox="0 0 24 24"><path d="' + SVGI[x[0]] + '"/></svg>' + x[1] + '</button>'; }
function buildSide() {
    document.getElementById('sa-sl').innerHTML = ICON_L.map(sideBtn).join('');
    document.getElementById('sa-sr').innerHTML = ICON_R.map(sideBtn).join('') + '<button class="sa-ic" onclick="SAC.exitWar()"><svg viewBox="0 0 24 24"><path d="' + SVGI.Bahar + '"/></svg>Bahar</button>';
}

function initMap() {
    if (SA.map) { try { SA.map.remove(); } catch (e) {} SA.map = null; }
    if (typeof L === 'undefined') return;
    SA.layers = {};
    SA.map = L.map('sa-map', { attributionControl: false, zoomSnap: 0.25, preferCanvas: true });
    SA.layer = L.geoJSON(assemblyData[ST.name], {
        style: function (f) { return seatStyle(f.properties.no); },
        onEachFeature: function (f, l) {
            var no = f.properties.no; SA.layers[no] = l;
            l.bindTooltip(function () { return seatTip(no); }, { sticky: true });
            l.on('click', function () { selectSeat(no); });
        }
    }).addTo(SA.map);
    SA.map.fitBounds(SA.layer.getBounds());
    setTimeout(function () { if (SA.map) { SA.map.invalidateSize(); SA.map.fitBounds(SA.layer.getBounds()); } }, 250);
}
function seatStyle(no) {
    var d = G.done[no], st;
    if (d) st = { fillColor: colOf(d.party), fillOpacity: 0.88, color: '#0b1120', weight: 0.6 };
    else if (inCurPhase(no) && !revealed()) st = { fillColor: '#1d4f8a', fillOpacity: 0.5, color: '#3b82f6', weight: 0.9 };
    else if (inCurPhase(no)) { var l = leadOf(no); st = { fillColor: colOf(l.party), fillOpacity: 0.32 + Math.min(0.5, l.margin * 3), color: '#0b1120', weight: 0.8 }; }
    else st = { fillColor: '#334155', fillOpacity: 0.35, color: '#0b1120', weight: 0.5 };
    var s = ST.byNo[no];
    if (SA.selDiv && s.div === SA.selDiv) { st.color = '#22d3ee'; st.weight = 1.5; }
    if (SA.sel === no) { st.color = '#facc15'; st.weight = 3; }
    return st;
}
function seatTip(no) {
    var s = ST.byNo[no], d = G.done[no], h = '<b>' + no + '. ' + E(s.nm) + '</b>' + (s.t ? ' (' + s.t + ')' : '') + '<br>' + E(s.d) + ' | ' + E(s.div);
    if (d) return h + '<br><b>' + E(d.party) + '</b> jeete (+' + d.margin + '%)';
    if (inCurPhase(no) && !revealed()) h += '<br><i>Rujhan abhi nahi aaya</i>';
    else if (inCurPhase(no)) { var l = leadOf(no); h += '<br>' + l.list.slice(0, 3).map(function (e) { return E(e.party) + ' ' + Math.round(e.s * 100) + '%'; }).join(' | '); }
    else h += '<br><i>Aage ke phase mein</i>';
    return h;
}
function restyleAll() {
    if (!SA.layer) return;
    SA.layer.eachLayer(function (l) { l.setStyle(seatStyle(l.feature.properties.no)); });
}
function restyleOne(no) { if (SA.layers[no]) SA.layers[no].setStyle(seatStyle(no)); }
function selectSeat(no) {
    var prev = SA.sel; SA.sel = no; SA.selDiv = ST.byNo[no].div;
    if (prev) restyleOne(prev); restyleOne(no);
    refreshWar(); if (SA.panel) renderPanel();
}
function computeLive() {
    var nos = ST.phases[G.phase], st = { div: {}, win: { you: null, opp: null }, lose: { you: null, opp: null }, othBy: {} };
    if (!revealed()) return st;
    nos.forEach(function (no) {
        if (G.done[no]) return;
        var l = leadOf(no), k = campOfId(l.id), d = ST.byNo[no].div, e1 = l.list[1], dv = st.div[d] = st.div[d] || { you: 0, opp: 0, oth: 0, n: 0 };
        dv[k]++; dv.n++;
        if (k === 'oth') st.othBy[l.party] = (st.othBy[l.party] || 0) + 1;
        ['you', 'opp'].forEach(function (side) {
            if (k === side) { if (!st.win[side] || l.margin < st.win[side].m) st.win[side] = { no: no, m: l.margin }; }
            else if (e1 && campOfId(e1.id) === side) { if (!st.lose[side] || l.margin < st.lose[side].m) st.lose[side] = { no: no, m: l.margin }; }
        });
    });
    return st;
}
function liveLines(side, t, live, st) {
    if (!revealed()) return ['Abhi rujhan nahi aaya. Pehle round mein rally, guru aur karyakarta se zameen taiyar karo.', 'Pehla round khatam hote hi seat-wise rujhan dikhne lagenge.', 'Jaldi andaza chahiye to Survey karwao (kuch Cr lagenge).'];
    var L = [], tot = t[side] + live[side], gap = ST.maj - tot, nm = function (x) { return x.no + '. ' + E(ST.byNo[x.no].nm) + ' (' + (x.m * 100).toFixed(1) + '%)'; };
    if (side === 'oth') {
        L.push('<em>' + live.oth + '</em> seat par aage (is phase mein), <em>' + t.oth + '</em> pakki jeet');
        Object.keys(st.othBy).sort(function (a, b) { return st.othBy[b] - st.othBy[a]; }).slice(0, 3).forEach(function (p) { L.push('<em>' + E(p) + '</em> ' + st.othBy[p] + ' seat par aage'); });
        L.push('Bahumat ' + ST.maj + ': chhoti partiyan kingmaker ban sakti hain');
        return L;
    }
    L.push('<em>' + live[side] + '</em> seat par aage (is phase mein), <em>' + t[side] + '</em> pakki jeet');
    L.push(gap > 0 ? '<em>' + gap + '</em> seat aur chahiye bahumat (' + ST.maj + ') ke liye' : 'Bahumat ka aankda (' + ST.maj + ') paar!');
    var dvs = Object.keys(st.div).filter(function (d) { return st.div[d].n; }).sort(function (a, b) { return st.div[b][side] / st.div[b].n - st.div[a][side] / st.div[a].n; });
    if (dvs.length) { var b = dvs[0], w = dvs[dvs.length - 1]; L.push('Sabse majboot ilaka: <em>' + E(b) + '</em> (' + st.div[b][side] + '/' + st.div[b].n + ' seat aage)'); if (w !== b) L.push('Sabse kamzor ilaka: <em>' + E(w) + '</em> (' + st.div[w][side] + '/' + st.div[w].n + ' seat aage)'); }
    if (st.win[side]) L.push('Kaante ki jeet: ' + nm(st.win[side]));
    if (st.lose[side]) L.push('Haar ke kareeb: ' + nm(st.lose[side]));
    L.push('Hawa <em>' + (G.hawa[side] >= 0 ? '+' : '') + G.hawa[side] + '</em>');
    return L;
}
var SAMB = ['{d} mein {p} ke karyakartaon ne ghar-ghar sampark kiya.', '{p} ki nukkad sabha mein achhi bheed juti.', '{d} mein sthaniya mudde par charcha garam.', 'Sthaniya akhbar mein {p} ka interview chhapa.', 'Matdata suchi mein naye naam jude.', '{d} mein mausam ne rally par asar dala.', 'Yuva matdata soshal media par sakriya.', '{p} ne chai par charcha rakhi.'];
function ambient() {
    var ps = [G.you.main, G.opp.main].concat(G.you.allies, G.opp.allies), d = pick(ST.divs), p = pick(ps);
    newsPush(pick(SAMB).replace('{d}', d).replace('{p}', p));
}
function newsBox() {
    var b = document.getElementById('sa-bx-news'); if (!b) return;
    var sig = G.news.slice(0, 8).join('|'); if (sig === SA.nsig) return; SA.nsig = sig;
    var rest = G.news.slice(1, 8).join('      \u2022      ') || G.news[0] || '';
    b.innerHTML = '<div class="sa-bh"><div><small>Chunav ki khabar</small><b>Media Headline</b></div><span class="sa-live"><i></i>Live</span></div><div class="sa-hl sa-fade">' + E(G.news[0] || '') + '</div><div class="sa-mq"><span style="animation-duration:' + Math.max(24, Math.round(rest.length * 0.3)) + 's">' + E(rest) + '</span></div>';
}
var LT = null;
function startTicker() { stopTicker(); LT = setInterval(tickBox, 3200); }
function stopTicker() { if (LT) { clearInterval(LT); LT = null; } }
function tickBox() {
    var w = document.getElementById('sa-war');
    if (!G || !w || w.classList.contains('hidden') || !document.getElementById('sa-bottom') || G.stage !== 'war') return;
    SA.tk = (SA.tk || 0) + 1;
    var nos = ST.phases[G.phase], no = nos[(SA.tk * 7) % nos.length], v = document.getElementById('sa-vt');
    if (v) v.innerHTML = seatTickHtml(no);
    if (SA.tk % 3 === 0 && Math.random() < 0.75) { ambient(); newsBox(); }
}
function campName(side) {
    var camp = side === 'you' ? G.you : G.opp;
    if (!camp.allies.length) return camp.main;
    var b = partyBloc(camp.main), n = BLOC_NAME[b];
    return (n && b !== 'oth') ? n : camp.main + '+';
}
function banner(side, seats) {
    var camp = side === 'you' ? G.you : G.opp, col = colOf(camp.main), nm = campName(side);
    var logos = em(camp.main, 'sm') + camp.allies.slice(0, 3).map(function (p) { return em(p, 'xs'); }).join('');
    return '<div class="sa-ban ' + (side === 'you' ? 'l' : 'r') + '" style="--c:' + col + '"><div class="lg">' + logos + '</div><div class="nm"><b>' + E(nm) + '</b><small>' + (side === 'you' ? 'Aap' : 'Rival') + '</small></div><div class="ct"><span>' + seats + '</span><i style="width:' + clamp(seats / ST.maj * 100, 0, 100) + '%"></i></div></div>';
}
function seatTickHtml(no) {
    var s = ST.byNo[no]; if (!s) return '';
    if (!revealed()) return '<div class="sa-vchip"><i></i>VOTING</div><div class="sa-vnm sa-fade"><b>' + E(s.nm) + '</b><small>' + E(s.div) + ' | matdaan jaari</small></div><div class="sa-vbar"><u></u></div>';
    var l = leadOf(no);
    return '<div class="sa-vchip"><i></i>RUJHAN</div><div class="sa-vnm sa-fade"><b>' + E(s.nm) + '</b><small>' + E(s.div) + '</small></div><div class="sa-vlead sa-fade">' + em(l.party, 'xs') + '<b style="color:' + colOf(l.party) + '">' + E(l.party) + '</b><span>+' + (l.margin * 100).toFixed(1) + '%</span></div>';
}
function seatStatusBox() {
    var nos = ST.phases[G.phase], no = nos[0], rv = revealed();
    return '<div class="sa-bx" id="sa-bx-seat" style="--c:#38bdf8"><div class="sa-bh"><div><small>Seat Status</small><b>' + (rv ? 'Rujhan aa rahe hain' : 'Voting jaari') + '</b></div><span class="sa-live"><i></i>Live</span></div><div class="sa-vt" id="sa-vt">' + seatTickHtml(no) + '</div></div>';
}
function stateStatusBox() {
    var rv = revealed(), divs = phaseDivs().sort(function (a, b) { return phaseSeatsOfDiv(b).length - phaseSeatsOfDiv(a).length; }).slice(0, 5);
    var rows = divs.map(function (d) {
        var seats = phaseSeatsOfDiv(d), n = seats.length, y = 0, o = 0;
        if (rv) seats.forEach(function (no) { var k = campOfId(leadOf(no).id); if (k === 'you') y++; else if (k === 'opp') o++; });
        var bar = rv ? '<i style="width:' + (y / n * 100) + '%;background:' + colOf(G.you.main) + '"></i><i style="width:' + ((n - y - o) / n * 100) + '%;background:#64748b"></i><i style="width:' + (o / n * 100) + '%;background:' + colOf(G.opp.main) + '"></i>' : '<i style="width:100%"></i>';
        return '<div class="sa-dr"><span>' + E(d) + '</span><div class="sa-dbar' + (rv ? '' : ' sh') + '">' + bar + '</div><b>' + n + '</b></div>';
    }).join('');
    var pct = Math.round(((G.round - 1) / ROUNDS) * 100);
    return '<div class="sa-bx" id="sa-bx-state" style="--c:#8aa4ff"><div class="sa-bh"><div><small>State Status</small><b>' + (rv ? 'Rujhan: division-wise' : 'Matdaan chal raha hai') + ' (' + pct + '%)</b></div><span class="sa-live"><i></i>Live</span></div><div class="sa-tp"><i style="width:' + Math.max(4, pct) + '%"></i></div>' + rows + '</div>';
}
function sideBox(side, t, live) {
    var name = side === 'you' ? G.you.main : (side === 'opp' ? G.opp.main : 'Anya dal'), col = side === 'oth' ? '#94a3b8' : colOf(name), lbl = side === 'you' ? 'Aapka gathbandhan' : (side === 'opp' ? 'Rival gathbandhan' : 'Anya'), tot = t[side] + live[side];
    var first = (SA.lines && SA.lines[side] && SA.lines[side][0]) || '';
    return '<div class="sa-bx" id="sa-bx-' + side + '" style="--c:' + col + '"><div class="sa-bh">' + (side === 'oth' ? '' : em(name, 'sm')) + '<div><small>' + lbl + '</small><b>' + E(name) + '</b></div><span class="sa-live"><i></i>Live</span></div>' +
        '<div class="sa-nums"><div>' + t[side] + '<small>jeete</small></div><div style="color:' + col + '">' + (revealed() ? live[side] : '&ndash;') + '<small>is phase mein aage</small></div></div>' +
        '<div class="sa-pr"><i style="width:' + clamp(tot / ST.maj * 100, 0, 100) + '%;background:' + col + '"></i><u style="right:0"></u></div><div class="sa-lv" id="sa-lv-' + side + '"><div>' + first + '</div></div></div>';
}
function refreshWar() {
    if (!G) return; fixG();
    var ph = G.phase, nPh = ST.phases.length, t = tallyDone(), live = tallyLive(ph), rv = revealed();
    var ys = t.you + (rv ? live.you : 0), os = t.opp + (rv ? live.opp : 0);
    document.getElementById('sa-top').innerHTML =
        '<button class="sa-back" onclick="SAC.exitWar()">&larr;</button>' + banner('you', ys) +
        '<div class="sa-mid"><div class="ttl">' + E(ST.name) + '</div><div class="sub">Phase <b>' + (ph + 1) + '/' + nPh + '</b> &middot; Round <b>' + G.round + '/' + ROUNDS + '</b> &middot; Bahumat <b>' + ST.maj + '</b></div><div class="sav"><i></i>Auto-save</div></div>' + banner('opp', os) +
        '<button class="sa-btn" onclick="SAC.nextRound()">' + (G.round >= ROUNDS ? 'PHASE KHATAM &#9654;' : 'AGLA ROUND &#9654;') + '</button>';
    var mt = function (n, v, col, label) { return '<div class="sa-m"><span>' + n + '</span><i><u style="height:' + clamp(v, 0, 100) + '%;background:' + col + '"></u></i><b>' + label + '</b></div>'; };
    var cap = phaseFund(ph) + 60;
    document.getElementById('sa-meters').innerHTML = mt('Stamina', G.stamina, G.stamina > 40 ? 'linear-gradient(#58c49a,#2f8f6d)' : '#e0674a', G.stamina + '%') + mt('Budget', G.budget / cap * 100, 'linear-gradient(#f0b04a,#c9892a)', Math.round(G.budget));
    document.getElementById('sa-bottom').innerHTML = seatStatusBox() + stateStatusBox() + '<div class="sa-bx" id="sa-bx-news" style="--c:#f0b04a"></div>';
    SA.nsig = ''; newsBox();
    var divs = phaseDivs();
    document.getElementById('sa-divs').innerHTML = divs.map(function (d) { return '<button class="' + (SA.selDiv === d ? 'on' : '') + '" onclick="SAC.divFocus(\'' + Q(d) + '\')">' + E(d) + ' (' + phaseSeatsOfDiv(d).length + ')</button>'; }).join('');
    seatCard();
}

function seatCard() {
    var el = document.getElementById('sa-seatcard');
    if (!SA.sel) { el.style.display = 'none'; return; }
    var no = SA.sel, s = ST.byNo[no], d = G.done[no], inP = inCurPhase(no);
    var h = '<h4>' + no + '. ' + E(s.nm) + (s.t ? ' (' + s.t + ')' : '') + '</h4><small style="color:#94a3b8">' + E(s.d) + ' | ' + E(s.div) + (s.pc ? ' | LS: ' + E(s.pc) : '') + '</small>';
    if (d) h += '<div style="margin-top:6px"><b style="color:' + colOf(d.party) + '">' + E(d.party) + '</b> jeete, margin ' + d.margin + '%</div>';
    else if (inP) {
        var l = revealed() ? leadOf(no) : null;
        if (!l) h += '<div style="margin-top:6px;color:#94a3b8">Rujhan abhi nahi aaya. Pehla round khatam hone par dikhega, ya Survey karwao.</div>';
        else h += '<div style="margin-top:6px">' + l.list.slice(0, 4).map(function (e) { return '<div style="display:flex;align-items:center;gap:6px">' + em(e.party, 'xs') + '<span style="flex:1">' + E(e.party) + (e.id === 'you' ? ' (aap)' : (e.id === 'opp' ? ' (rival)' : '')) + '</span><b>' + Math.round(e.s * 100) + '%</b></div>'; }).join('') + '</div>';
        var m = G.mod.you, tags = [];
        if (m.guru[no]) tags.push('Guru'); if (m.kar[no]) tags.push('Karyakarta'); if (m.off[no]) tags.push('DM/SP'); if (m.rallyS[no]) tags.push('Rally'); if (m.poach[no]) tags.push('Dalbadlu'); if (m.medS && m.medS[no]) tags.push('Media'); if (m.vip && m.vip[no]) tags.push('VIP');
        if (tags.length) h += '<div style="margin-top:4px">' + tags.map(function (x) { return '<span class="sa-chip g">' + x + '</span>'; }).join('') + '</div>';
        h += '<div class="q"><button class="sa-btn sm b1" onclick="SAC.act(\'rs\')">Rally 8</button><button class="sa-btn sm b2" onclick="SAC.act(\'ks\')">Karyakarta 5</button><button class="sa-btn sm b3" onclick="SAC.act(\'ms\')">Media 3</button></div>';
        if (SA.msg) h += '<div class="sa-msg' + (SA.msg.bad ? ' bad' : '') + '" style="margin-top:8px">' + E(SA.msg.t) + '</div>';
    } else h += '<div style="margin-top:6px;color:#94a3b8">Ye seat aage ke phase mein hai.</div>';
    el.innerHTML = h; el.style.display = 'block';
}
function divFocus(d) {
    SA.selDiv = d;
    var seats = phaseSeatsOfDiv(d);
    if (seats.length && (!SA.sel || ST.byNo[SA.sel].div !== d)) SA.sel = seats[0];
    restyleAll(); refreshWar();
    if (SA.map && seats.length) { var g = L.featureGroup(seats.map(function (n) { return SA.layers[n]; }).filter(Boolean)); SA.map.fitBounds(g.getBounds(), { padding: [30, 30] }); }
    if (SA.panel) renderPanel();
}
function exitWar() {
    if (!confirm('War-room se bahar jayein? Game save rahega.')) return;
    saveGame(); warEl().classList.add('hidden'); SA.panel = null; document.getElementById('sa-drawer').classList.add('hidden');
    openList();
}

// =============================================================
//  PANELS (sidebar icons)
// =============================================================
function makeAct(kind, arg) {
    switch (kind) {
        case 'rs': return A_rallySeat(SA.sel);
        case 'rd': return A_rallyDiv(SA.selDiv);
        case 'rst': return A_rallyState();
        case 'gu': return A_guru(SA.sel);
        case 'ks': return A_karSeat(SA.sel);
        case 'kd': return A_karDiv(SA.selDiv);
        case 'it': return A_it();
        case 'media': return A_media();
        case 'mf': return A_manifesto(arg);
        case 'co': return A_contro(arg);
        case 'dm': return A_official(SA.sel, 'DM');
        case 'sp': return A_official(SA.sel, 'SP');
        case 'po': return A_poach(SA.sel);
        case 'sv': return A_survey();
        case 'donor': return A_donor();
        case 'crowd': return A_crowd();
        case 'black': return A_black();
        case 'cm': return A_cmFace(arg);
        case 'md': return A_mediaDiv(SA.selDiv);
        case 'ms': return A_mediaSeat(SA.sel);
        case 'dn': return A_donorDeal(arg);
        case 'bk': return A_blackSrc(arg);
        case 'ln': return A_loan(parseInt(arg, 10));
        case 'rest': return A_rest(arg);
        case 'ct': var q = String(arg).split('|'); return A_court(q[0], q[1]);
        case 'df': return A_defence(arg);
        case 'spy': return A_spy();
        case 'mcc': return A_mcc();
        case 'vp': return A_vip(SA.sel, (document.getElementById('sa-vipname') || {}).value || '');
        case 'dp': return A_dep(arg);
    }
    return null;
}
function doAct(kind, arg) {
    if (G.stage !== 'war') return;
    var a = makeAct(kind, arg);
    if (!a) return;
    var r = execYou(a);
    SA.msg = { t: r.text, bad: !r.ok || !r.good };
    if (SA.sel) restyleOne(SA.sel);
    if (['rest', 'ln', 'bk', 'dn', 'df', 'cm', 'dp'].indexOf(kind) < 0) restyleAll();
    refreshWar(); renderPanel();
}
function whyHtml(a) {
    var w = a.check('you');
    return w ? '<div style="color:#fca5a5;font-size:.76rem;margin-top:3px">' + E(w) + '</div>' : '';
}
function card(title, desc, kind, arg, btnLabel, cls) {
    var a = makeAct(kind, arg), w = a.check('you');
    var dis = w || G.budget < a.cost || G.stamina < a.stamina;
    return '<div class="sa-row"><span class="t"><b>' + E(title) + '</b><small>' + desc + '</small>' +
        '<small>Kharch: <b style="color:#fde68a">' + a.cost + ' Cr</b> | Stamina: ' + a.stamina + '%</small>' + (w ? '<div style="color:#fca5a5;font-size:.76rem">' + E(w) + '</div>' : '') + '</span>' +
        '<button class="sa-btn sm ' + (cls || '') + '"' + (dis ? ' disabled' : '') + ' onclick="SAC.act(\'' + kind + '\',\'' + Q(arg == null ? '' : arg) + '\')">' + btnLabel + '</button></div>';
}
function selector() {
    var divs = phaseDivs();
    if (divs.indexOf(SA.selDiv) < 0) SA.selDiv = divs[0];
    var seats = phaseSeatsOfDiv(SA.selDiv);
    if (seats.indexOf(SA.sel) < 0) SA.sel = seats[0];
    return '<div class="sa-panel" style="padding:10px"><div style="margin-bottom:6px">Division: <select class="sa-select" onchange="SAC.divFocus(this.value)">' + divs.map(function (d) { return '<option value="' + E(d) + '"' + (d === SA.selDiv ? ' selected' : '') + '>' + E(d) + ' (' + phaseSeatsOfDiv(d).length + ')</option>'; }).join('') + '</select></div>' +
        '<div>Seat: <select class="sa-select" onchange="SAC.pickSeat(this.value)">' + seats.map(function (no) { return '<option value="' + no + '"' + (no === SA.sel ? ' selected' : '') + '>' + no + '. ' + E(ST.byNo[no].nm) + '</option>'; }).join('') + '</select></div></div>';
}
function strip() { return ''; }
function msgHtml() { return SA.msg ? '<div class="sa-msg' + (SA.msg.bad ? ' bad' : '') + '">' + E(SA.msg.t) + '</div>' : ''; }
function head(t, s) { return '<div style="display:flex;justify-content:space-between;align-items:start"><div><h2>' + E(t) + '</h2><div class="sub">' + s + '</div></div><button class="sa-back" onclick="SAC.closePanel()">&times;</button></div>' + strip() + msgHtml(); }

function panelBody(name) {
    fixG();
    var m = G.mod.you, st = stMod(m, G.phase), dvn = SA.selDiv, h;
    var cnt = function (o, k) { return (o && o[k]) || 0; };
    switch (name) {
        case 'Rally': return head('Rally', 'Division mein 5 mega-rally karo to us division ka 25-30% vote pakka. Seat rally seat par dabane se milti hai.') + selector() +
            '<div class="sa-chips"><div class="sa-stat">' + E(dvn) + ' mein rally<b>' + cnt(m.rdn, dvn) + '/5</b></div></div>' +
            card('Division mega-rally', E(dvn) + ' ki sabhi seat par har rally ~5.8% (5 baar = 25-30%).', 'rd', null, 'Karo') + card('Pradesh-vyapi rally', 'Is phase ki sabhi seat par ~1% vote.', 'rst', null, 'Karo');
        case 'Local Guru': return head('Local Guru', 'Seat ke prabhavshali guru saath aaye to ~25% voter aapke paksh mein.') + selector() + card('Local guru ko saath lo', 'Chuni hui seat par ~25% voter.', 'gu', null, 'Saath lo');
        case 'Karyakarta': return head('Karyakarta', 'Division mein ek baar lagao to 15-20% voter paksh mein. Is phase mein sirf 2 division (' + kdn('you') + '/2). Seat par 35%.') + selector() +
            card('Karyakarta (division)', E(dvn) + ' ki sabhi seat par 15-20% voter.', 'kd', null, 'Lagao') + card('Karyakarta (seat)', 'Chuni hui seat par 35% voter.', 'ks', null, 'Lagao');
        case 'IT & Media': return head('IT Cell aur Media', 'Division mein 5 media campaign poore karo to ~25-30% vote pakka. Rally aur media dono poore to 50-60% seat tak pakad.') + selector() +
            '<div class="sa-chips"><div class="sa-stat">' + E(dvn) + ' media<b>' + cnt(m.mdn, dvn) + '/5</b></div><div class="sa-stat">IT level<b>' + Math.round(st.it * 100) + '/3</b></div></div>' +
            card('Media campaign (division)', E(dvn) + ' ki sabhi seat par har campaign ~5.8%.', 'md', null, 'Chalao') + card('Social media (seat)', 'Chuni hui seat par ~12% vote.', 'ms', null, 'Chalao') +
            card('IT Cell (pradesh)', 'Har baar +1% vote (max 3).', 'it', null, 'Chalao') + card('Media debate (pradesh)', 'Har baar +0.8% vote.', 'media', null, 'Chalao');
        case 'Manifesto': return head('Ghoshna-patra', 'Har vaada ek baar. Har vargh ke liye alag vote %. Ghoshit vaadon ka bojh har naye phase mein 4 Cr per vaada katega.') +
            MANIFESTO.map(function (x) { return card(x.name, E(x.grp) + ': poore pradesh mein ~' + (x.g * 100).toFixed(1) + '% vote.', 'mf', x.id, 'Ghoshit karo'); }).join('');
        case 'Controversy': return head('Controversy', 'Safal hui to rival ka 15% vote share jata hai, ulti padi to aapka 2%. Ek phase mein max 2 (abhi ' + G.cnt.contro.you + '/2).') +
            CONTRO.map(function (c) { return card(c.name, 'Safal hone ki sambhavna ~' + Math.round(c.p * 100) + '%.', 'co', c.id, 'Chalao', 'o'); }).join('');
        case 'Court':
            return head('Court', 'Virodhi par case karo: safal hua to uska ~10% vote share jata hai. Bada wakeel = zyada safalta. Phase mein 2 case (' + G.cnt.court.you + '/2).') +
                '<div class="sa-panel" style="padding:10px">Mudda: <select id="sa-topic" class="sa-select">' + CASE_TOPICS.map(function (t) { return '<option>' + E(t) + '</option>'; }).join('') + '</select></div>' +
                LAWYERS.map(function (l) { var a = A_court(CASE_TOPICS[0], l.id), w = a.check('you'), dis = w || G.budget < a.cost || G.stamina < a.stamina; return '<div class="sa-row"><span class="t"><b>' + l.name + '</b><small>Safalta ~' + Math.round(l.chance * 100) + '% | Kharch ' + l.fee + ' Cr | Stamina 5%</small>' + (w ? '<div style="color:#fca5a5;font-size:.76rem">' + E(w) + '</div>' : '') + '</span><button class="sa-btn sm o"' + (dis ? ' disabled' : '') + ' onclick="SAC.court(\'' + l.id + '\')">Case karo</button></div>'; }).join('') +
                '<div class="sa-sec">Bachav wakeel (is phase ke liye)</div>' + LAWYERS.map(function (l) { return card(l.name, 'Rival ke case ki safalta ghatata hai.', 'df', l.id, 'Rakho'); }).join('');
        case 'EC': return head('EC (MCC)', 'Chunav aayog mein shikayat. Pehle Spy se sabut jutao. Safal hui to rival ke kuch ummeedwaron ka namankan radd.') +
            '<div class="sa-chips"><div class="sa-stat">Aapke paas sabut<b>' + (G.evid.you || 0) + '</b></div></div>' + card('Aachar-sanhita shikayat', 'Sabut jitne zyada, safalta utni zyada. Phase mein ek baar.', 'mcc', null, 'Shikayat karo', 'o');
        case 'Spy': return head('Spy', 'Jasoos rival ke aachar-sanhita ulanghan (DM/SP badalna, dalbadlu, kala dhan) ke sabut jutata hai. 75% safal, phase mein 2 baar.') +
            '<div class="sa-chips"><div class="sa-stat">Aapke paas sabut<b>' + (G.evid.you || 0) + '</b></div></div>' + card('Jasoos lagao', 'Rival ke ulanghan khojo. Sabut EC mein kaam aayega.', 'spy', null, 'Bhejo');
        case 'VIP': return head('VIP Seat', 'Kisi seat par VIP ummeedwar utaro: +15% vote. Zyada se zyada 8 seat.') + selector() +
            '<div class="sa-panel" style="padding:10px">VIP ka naam (zaruri nahi): <input id="sa-vipname" class="sa-select" placeholder="naam"></div>' + card('VIP ummeedwar utaro', 'Chuni hui seat par ~15% vote.', 'vp', null, 'Ghoshit karo') +
            Object.keys(G.vips.you).map(function (no) { var v = G.vips.you[no]; return '<div class="sa-row"><span class="t"><b>' + E(v.name) + '</b><small>' + E(seatName(+no)) + '</small></span><b>' + (v.won == null ? 'Chunav baaki' : (v.won ? 'Jeete' : 'Haare')) + '</b></div>'; }).join('');
        case 'Aaram': return head('Stamina', 'Stamina khatam ho jaye to yahan se wapas paao.') +
            card('Aaram', '+20% stamina, 3 Cr. Phase mein 2 baar (' + G.cnt.rest + '/2).', 'rest', 'aaram', 'Aaram karo') + card('Energy team (doctor + helicopter)', '+35% stamina, 8 Cr. Phase mein ek baar (' + G.cnt.team + '/1).', 'rest', 'team', 'Team bulao');
        case 'DM/SP': return head('DM / SP Transfer', 'Seat wise tabadla: DM par ~20% aur SP par ~15% vote fayda. 35% bhed khulne ka khatra.') + selector() +
            card('Zila Magistrate (DM) badlo', 'Chuni hui seat par ~20% vote.', 'dm', null, 'Badlo', 'o') + card('Police Adhikshak (SP) badlo', 'Chuni hui seat par ~15% vote.', 'sp', null, 'Badlo', 'o');
        case 'Dalbadlu': return head('Dalbadlu', 'Virodhi khemey ka bada neta todo (60% safal, ~15% vote).') + selector() + card('Neta ko todo', 'Chuni hui seat par ~15% vote.', 'po', null, 'Todo', 'o');
        case 'Funds':
            h = head('Funds', 'Chanda, corporate partner, kala dhan aur loan. Kala dhan jokhim hai (abhi risk ' + (G.risk || 0) + '%).');
            h += card('Chanda (safed)', '+20 Cr. Phase mein 2 baar (' + G.cnt.donor + '/2).', 'donor', null, 'Jama karo');
            h += '<div class="sa-sec">Corporate partners (har phase paisa)</div>' + DONORS.map(function (d) { var o = G.donors[d.id]; return card(d.name, 'Har phase +' + d.pay + ' Cr. ' + (o ? (o === 'you' ? 'Aapke saath.' : 'Rival ke saath.') : 'Abhi koi nahi.') + ' Sauda ~55% safal.', 'dn', d.id, 'Baat karo'); }).join('');
            h += '<div class="sa-sec">Kala dhan (jokhim)</div>' + Object.keys(BLACK_SRC).map(function (k) { var b = BLACK_SRC[k]; return card(b.name, '+' + b.lo + ' se ' + b.hi + ' Cr. Jokhim +' + b.risk + '%. Phase mein 2 baar (' + G.cnt.black + '/2).', 'bk', k, 'Lo', 'o'); }).join('');
            h += '<div class="sa-sec">Loan</div>' + (G.loan.you ? '<div class="sa-msg">Baaki loan: ' + G.loan.you.due + ' Cr (agle phase mein katega).</div>' : '') + card('Loan 30 Cr', 'Agle phase mein 38 Cr lautane honge.', 'ln', 30, 'Lo') + card('Loan 60 Cr', 'Agle phase mein 75 Cr lautane honge.', 'ln', 60, 'Lo');
            return h;
        case 'CM Face':
            h = head('CM Chehra', 'Apne gathbandhan ke bade netaon mein se CM ka chehra aur 3-4 upmukhyamantri chehre chuno.');
            h += '<div class="sa-msg">CM chehra: <b>' + E(G.cmFace || 'abhi tay nahi') + '</b><br>Upmukhyamantri chehre: <b>' + (G.deps.length ? E(G.deps.join(', ')) : 'koi nahi') + ' (' + G.deps.length + '/4)</b></div>';
            G.you.camp.forEach(function (p) {
                var ls = leadersOf(p); if (!ls.length) return;
                h += '<div class="sa-sec" style="display:flex;align-items:center;gap:8px">' + em(p, 'xs') + E(p) + '</div>';
                ls.forEach(function (n) {
                    var isCm = G.cmFace === n, isDp = G.deps.indexOf(n) >= 0;
                    h += '<div class="sa-row">' + leaderImg(n, p, 'sm') + '<span class="t"><b>' + E(n) + '</b><small>' + E(p) + (isCm ? ' | CM chehra' : (isDp ? ' | Upmukhyamantri chehra' : '')) + '</small></span><div style="display:flex;gap:6px"><button class="sa-btn sm"' + (G.cmFace || isDp ? ' disabled' : '') + ' onclick="SAC.act(\'cm\',\'' + Q(n) + '\')">CM</button><button class="sa-btn sm gh"' + (isCm || isDp || G.deps.length >= 4 ? ' disabled' : '') + ' onclick="SAC.act(\'dp\',\'' + Q(n) + '\')">Dy. CM</button></div></div>';
                });
            });
            return h;
        case 'Survey': return head('Survey', 'Paid survey se is phase ke rujhan pehle hi dekh sakte ho. Warna pehla round khatam hone par apne aap dikhenge.') + card('Survey karwao', 'Kharch 10 Cr, stamina 5%. Seat-wise rujhan map aur boxes mein dikhenge.', 'sv', null, 'Karwao');
        case 'Seats': return head('Kaante ki seat', 'Sirf wo seat jahan aap 10% ke andar aage ya peeche hain. Baaki seat ke liye map par seedha seat dabao.') + seatList();
    }
    return '';
}
function seatList() {
    if (!revealed()) return '<div class="sa-msg">Rujhan abhi nahi aaya. Pehla round khatam hone par ya Survey se kaante ki seat dikhengi. Tab tak map par seedha seat dabao.</div>';
    var rows = ST.phases[G.phase].map(function (no) {
        var e = entityList(no, false), you = e.filter(function (x) { return x.id === 'you'; })[0] || e[e.length - 1], top = e[0];
        var diff = top.id === 'you' ? top.s - (e[1] ? e[1].s : 0) : top.s - you.s;
        return { no: no, diff: diff, top: top, you: you };
    }).filter(function (r) { return r.diff <= 0.1; }).sort(function (a, b) { return a.diff - b.diff; });
    if (!rows.length) return '<div class="sa-msg">Abhi koi seat 10% ke andar ki takkar mein nahi hai.</div>';
    return rows.map(function (r) {
        var s = ST.byNo[r.no], lead = r.top.id === 'you';
        return '<div class="sa-row" style="border-left:5px solid ' + colOf(r.top.party) + ';cursor:pointer" onclick="SAC.pickSeat(' + r.no + ',true)">' + em(r.top.party, 'sm') + '<span class="t"><b>' + r.no + '. ' + E(s.nm) + '</b><small>' + E(s.div) + '</small></span><span><b style="color:' + colOf(r.top.party) + '">' + E(r.top.party) + '</b><small>' + (lead ? 'aap +' : 'aap -') + (r.diff * 100).toFixed(1) + '%</small></span></div>';
    }).join('');
}
function openPanel(name) { SA.panel = name; SA.msg = ''; renderPanel(); }
function renderPanel() {
    var d = document.getElementById('sa-drawer'), bw = document.getElementById('sa-bodyw');
    if (!SA.panel) { d.classList.add('hidden'); if (bw) bw.classList.remove('dr'); return; }
    var right = ICON_R.some(function (x) { return x[0] === SA.panel; });
    d.className = 'sa-drawer ' + (right ? 'r' : 'l'); d.innerHTML = panelBody(SA.panel);
    if (bw) { if (right) bw.classList.add('dr'); else bw.classList.remove('dr'); }
    document.querySelectorAll('.sa-ic').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-p') === SA.panel); });
}
function closePanel() { SA.panel = null; renderPanel(); document.querySelectorAll('.sa-ic').forEach(function (b) { b.classList.remove('on'); }); }
function pickSeat(no, zoom) {
    no = parseInt(no, 10); if (!ST.byNo[no]) return;
    selectSeat(no);
    if (zoom && SA.map && SA.layers[no]) SA.map.fitBounds(SA.layers[no].getBounds(), { maxZoom: 9, padding: [40, 40] });
}

// =============================================================
//  ROUND / PHASE / RESULT SCREENS
// =============================================================
function nextRound() {
    if (G.stamina > 60 && !confirm('Abhi stamina ' + G.stamina + '% bachi hai. Round khatam karein?')) return;
    var r = endRound();
    SA.msg = '';
    if (r.phaseEnded) { closePanel(); phaseResultScreen(r.res); return; }
    refreshWar(); restyleAll(); renderPanel();
}
function bars(a, b, c) {
    var t = (a + b + c) || 1;
    return '<div class="sa-bar"><i style="width:' + (a / t * 100) + '%;background:' + colOf(G.you.main) + '"></i><i style="width:' + (c / t * 100) + '%;background:#64748b"></i><i style="width:' + (b / t * 100) + '%;background:' + colOf(G.opp.main) + '"></i></div>';
}
function phaseResultScreen(res) {
    G.stage = 'phaseResult'; saveGame();
    var more = G.phase < ST.phases.length - 1, t = res.total;
    var chips = Object.keys(res.parties).sort(function (a, b) { return res.parties[b] - res.parties[a]; }).map(function (p) { return '<span class="sa-chip" style="border-left:4px solid ' + colOf(p) + '">' + E(p) + ' <b>' + res.parties[p] + '</b></span>'; }).join('');
    var close = res.close.map(function (c) { var s = ST.byNo[c.no]; return '<div class="sa-row" style="border-left:5px solid ' + colOf(c.d.party) + '"><span class="t"><b>' + c.no + '. ' + E(s.nm) + '</b><small>' + E(s.div) + ' | doosre number par ' + E(c.d.ru) + '</small></span><span><b style="color:' + colOf(c.d.party) + '">' + E(c.d.party) + '</b><small>jeet ka antar ' + c.d.margin + '%</small></span></div>'; }).join('');
    var body = '<div class="sa-grid2"><div class="sa-panel"><h3>PHASE ' + (res.ph + 1) + ' KA NATIJA (' + res.seats + ' SEAT)</h3>' + bars(res.you, res.opp, res.oth) +
        '<div class="sa-chips"><div class="sa-stat">Aap<b style="color:#4ade80">' + res.you + '</b></div><div class="sa-stat">Rival<b style="color:#f87171">' + res.opp + '</b></div><div class="sa-stat">Anya<b>' + res.oth + '</b></div></div><div class="sa-chips">' + chips + '</div>' +
        '<h3 style="margin-top:12px">ABHI TAK KUL</h3>' + bars(t.you, t.opp, t.oth) + '<div class="sa-chips"><div class="sa-stat">Aap<b style="color:#4ade80">' + t.you + '</b></div><div class="sa-stat">Rival<b style="color:#f87171">' + t.opp + '</b></div><div class="sa-stat">Anya<b>' + t.oth + '</b></div><div class="sa-stat">Bahumat<b>' + ST.maj + '</b></div></div>' +
        '<button class="sa-btn" onclick="SAC.afterPhase()">' + (more ? 'AGLA PHASE &rarr;' : 'EXIT POLL DEKHO &rarr;') + '</button></div>' +
        '<div class="sa-panel"><h3>SABSE KAANTE KI TAKKAR</h3>' + close + '</div></div>';
    showUi('Phase ' + (res.ph + 1) + ' ka Natija', ST.name, body, 'SAC.close()');
}
function afterPhase() {
    if (G.phase < ST.phases.length - 1) { nextPhase(); G.stage = 'war'; SA.sel = ST.phases[G.phase][0]; SA.selDiv = ST.byNo[SA.sel].div; buildWar(); }
    else exitPollScreen();
}
function exitPollScreen() {
    G.stage = 'exitpoll'; if (!G.poll) G.poll = exitPoll(); saveGame();
    var p = G.poll;
    var body = '<div class="sa-panel" style="max-width:720px;margin:0 auto"><h3>EXIT POLL (ANDAAZA, GALAT BHI HO SAKTA HAI)</h3>' +
        '<div class="sa-row" style="border-left:5px solid ' + colOf(G.you.main) + '"><span class="t"><b>' + E(G.you.main) + ' gathbandhan</b></span><b style="font-size:1.4rem">' + p.you[0] + ' - ' + p.you[1] + '</b></div>' +
        '<div class="sa-row" style="border-left:5px solid ' + colOf(G.opp.main) + '"><span class="t"><b>' + E(G.opp.main) + ' gathbandhan</b></span><b style="font-size:1.4rem">' + p.opp[0] + ' - ' + p.opp[1] + '</b></div>' +
        '<div class="sa-row" style="border-left:5px solid #64748b"><span class="t"><b>Anya</b></span><b style="font-size:1.4rem">~' + p.oth + '</b></div>' +
        '<p style="color:#94a3b8">Bahumat ka aankda: <b>' + ST.maj + '</b>. Asli natija matganana ke din pata chalega.</p><button class="sa-btn" onclick="SAC.counting()">MATGANANA SHURU KARO &rarr;</button></div>';
    showUi('Exit Poll', ST.name, body, 'SAC.close()');
}
function cbn(side) {
    var camp = side === 'you' ? G.you : G.opp;
    return '<div class="sa-cbn ' + (side === 'you' ? 'l' : 'r') + '" id="sa-cbn-' + side + '" style="--c:' + colOf(camp.main) + '">' + em(camp.main, 'lg') + '<div><div class="w">' + E(campName(side)) + '</div><small>' + (side === 'you' ? 'Aap' : 'Rival') + '</small></div><b class="n" id="sa-cn-' + side + '">0</b></div>';
}
function countingScreen() {
    G.stage = 'counting'; saveGame();
    var order = ST.seats.map(function (s) { return s.no; }), step = Math.max(1, Math.ceil(ST.n / 45)); SA.cnt = { i: 0, order: order, step: step };
    var body = '<div class="sa-cb">' + cbn('you') + '<div class="sa-cmid"><div class="sa-lv2"><i></i>LIVE MATGANANA</div><b id="sa-cn-i">0</b><small style="color:var(--mu)">/ ' + ST.n + ' seat ginti</small></div>' + cbn('opp') + '</div>' +
        '<div class="sa-mbar" id="sa-cn-bar"></div>' +
        '<div class="sa-grid2"><div class="sa-panel"><h3>TAAZA NATIJE</h3><div id="sa-cn-last"></div></div><div class="sa-panel"><h3>PARTY-WISE ABHI TAK</h3><div class="sa-chips" id="sa-cn-par"></div><div id="sa-cn-ctl" style="margin-top:14px"></div></div></div>';
    showUi('Matganana Diwas', ST.name + ' | ' + ST.n + ' seat', body, 'SAC.close()');
    drawCount();
    if (SA.timer) clearInterval(SA.timer);
    SA.timer = setInterval(function () {
        SA.cnt.i += SA.cnt.step;
        if (SA.cnt.i >= order.length) { SA.cnt.i = order.length; clearInterval(SA.timer); SA.timer = null; }
        drawCount();
    }, 420);
}
function drawCount() {
    var c = SA.cnt, y = 0, o = 0, x = 0, last = [], pars = {}, set = function (id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; };
    for (var i = 0; i < c.i; i++) { var d = G.done[c.order[i]], k = campOfId(d.id); if (k === 'you') y++; else if (k === 'opp') o++; else x++; pars[d.party] = (pars[d.party] || 0) + 1; }
    for (var j = c.i - 1; j >= Math.max(0, c.i - 7); j--) {
        var no = c.order[j], dd = G.done[no];
        last.push('<div class="sa-rs" style="--c:' + colOf(dd.party) + '">' + em(dd.party, 'sm') + '<span class="t"><b>' + no + '. ' + E(ST.byNo[no].nm) + '</b><small>' + E(ST.byNo[no].div) + ' | antar ' + dd.margin + '%</small></span><b style="color:' + colOf(dd.party) + '">' + E(dd.party) + '</b></div>');
    }
    set('sa-cn-you', y); set('sa-cn-opp', o); set('sa-cn-i', c.i);
    var done = c.i >= c.order.length;
    ['you', 'opp'].forEach(function (sd) { var e = document.getElementById('sa-cbn-' + sd); if (e) e.classList.toggle('lead', (sd === 'you' ? y : o) >= ST.maj); });
    set('sa-cn-bar', '<i style="width:' + (y / ST.n * 100) + '%;background:' + colOf(G.you.main) + '"></i><i style="width:' + (x / ST.n * 100) + '%;background:#64748b"></i><i style="width:' + (o / ST.n * 100) + '%;background:' + colOf(G.opp.main) + '"></i><u style="left:' + (ST.maj / ST.n * 100) + '%"><em>Bahumat ' + ST.maj + '</em></u>');
    set('sa-cn-last', last.join('') || '<div style="color:#94a3b8">Ginti shuru...</div>');
    set('sa-cn-par', Object.keys(pars).sort(function (a, b) { return pars[b] - pars[a]; }).map(function (p) { return '<span class="sa-chip" style="border-left:4px solid ' + colOf(p) + '">' + E(p) + ' <b>' + pars[p] + '</b></span>'; }).join(''));
    set('sa-cn-ctl', done ? '<button class="sa-btn" onclick="SAC.result()">NATIJA DEKHO &rarr;</button>' : '<button class="sa-btn gh sm" onclick="SAC.countSkip()">Seedha natija</button>');
}
function countSkip() { if (SA.timer) { clearInterval(SA.timer); SA.timer = null; } SA.cnt.i = SA.cnt.order.length; drawCount(); }
function confetti(n) { var cols = ['#f0b04a', '#58c49a', '#8aa4ff', '#e0674a', '#ffffff'], h = ''; for (var i = 0; i < n; i++) h += '<i style="left:' + Math.round(Math.random() * 100) + '%;background:' + cols[i % cols.length] + ';animation-delay:' + (Math.random() * 3).toFixed(2) + 's;animation-duration:' + (2.6 + Math.random() * 2).toFixed(2) + 's"></i>'; return '<div class="sa-conf">' + h + '</div>'; }
function youSeats() { return (G.final && G.final.byYou) || (G.ht && G.ht.you) || campSeatsByParty('you'); }

function hemi() {
    var parties = {};
    Object.keys(G.done).forEach(function (no) { var d = G.done[no]; parties[d.party] = (parties[d.party] || 0) + 1; });
    var yc = {}, oc = {};
    Object.keys(G.done).forEach(function (no) { var d = G.done[no]; if (d.id === 'you') yc[d.party] = 1; else if (d.id === 'opp') oc[d.party] = 1; });
    var cmp = function (a, b) { return parties[b] - parties[a]; };
    var order = Object.keys(parties).filter(function (p) { return yc[p]; }).sort(cmp)
        .concat(Object.keys(parties).filter(function (p) { return !yc[p] && !oc[p]; }).sort(cmp), Object.keys(parties).filter(function (p) { return oc[p] && !yc[p]; }).sort(cmp));
    var arr = order.map(function (p) { return [p, parties[p], colOf(p)]; });
    var legend = arr.map(function (r) { return '<span class="sa-chip" style="border-left:4px solid ' + r[2] + '">' + E(r[0]) + ' <b>' + r[1] + '</b></span>'; }).join('');
    return (typeof s34Hemi === 'function' ? '<div class="s34-hemi">' + s34Hemi(arr, ST.n) + '</div>' : '') + '<div class="sa-chips">' + legend + '</div>';
}
function resultScreen() {
    G.stage = 'result'; var t = tallyDone(); saveGame();
    var verdict, cls, next, win = t.you >= ST.maj;
    if (win) { verdict = 'Aapke gathbandhan ko poora bahumat mila!'; cls = 'g'; next = '<button class="sa-btn" onclick="SAC.formGov(true)">SARKAR BANAO &rarr;</button>'; G.final = { you: t.you, opp: t.opp, byYou: campSeatsByParty('you'), byOpp: campSeatsByParty('opp') }; G.result = 'win'; }
    else {
        var gap = ST.maj - t.you;
        if (t.opp >= ST.maj) { verdict = 'Rival gathbandhan ko bahumat mila. Aapko ' + gap + ' seat kam padi.'; cls = 'r'; } else { verdict = 'Trishanku vidhan sabha! Kisi ko bahumat nahi.'; cls = 'y'; }
        next = (gap <= Math.round(ST.n * 0.15) ? '<button class="sa-btn o" onclick="SAC.horse()">KHARID-FAROKHT (HORSE TRADING) &rarr;</button> ' : '') + '<button class="sa-btn gh" onclick="SAC.report()">Seedha report</button>';
    }
    var hero = win ? '<div class="sa-hero">' + confetti(46) + '<div style="font-size:3.2rem">&#127881;</div><h2>' + E(campName('you')) + ' ko bahumat!</h2><div style="color:#cbd5e1">' + t.you + ' / ' + ST.n + ' seat &middot; bahumat ' + ST.maj + '</div></div>' :
        '<div class="sa-hero" style="border-color:rgba(224,103,74,.5)"><div style="font-size:3.2rem">&#128202;</div><h2>' + E(verdict) + '</h2><div style="color:#cbd5e1">Aapke ' + t.you + ' | rival ' + t.opp + ' | anya ' + t.oth + '</div></div>';
    var body = hero + '<div class="sa-panel" style="margin-top:12px"><h3>CHUNAV KA NATIJA</h3>' + hemi() + '<div class="sa-chips"><div class="sa-stat">' + E(campName('you')) + '<b style="color:#4ade80">' + t.you + '</b></div><div class="sa-stat">' + E(campName('opp')) + '<b style="color:#f87171">' + t.opp + '</b></div><div class="sa-stat">Anya<b>' + t.oth + '</b></div><div class="sa-stat">Bahumat<b>' + ST.maj + '</b></div></div>' +
        '<div class="sa-verdict ' + cls + '">' + E(verdict) + '</div>' + next + '</div>';
    showUi('Natija: ' + ST.name, ST.n + ' seat', body, 'SAC.close()');
}

// ---------- horse trading ----------
function horseScreen(msg) {
    G.stage = 'horse'; if (!G.ht) startHT();
    var ht = G.ht, y = htTot(ht, 'you'), o = htTot(ht, 'opp');
    var targets = [];
    ['opp', 'oth'].forEach(function (from) {
        Object.keys(ht[from]).forEach(function (p) {
            if (ht[from][p] > 0) targets.push({ from: from, p: p, n: ht[from][p] });
        });
    });
    targets.sort(function (a, b) { return b.n - a.n; });
    var rows = targets.slice(0, 12).map(function (t) {
        var c1 = htCost(ht, t.from, t.p, 1), mk = function (k) { return '<button class="sa-btn sm o" ' + (t.n < k ? 'disabled ' : '') + 'onclick="SAC.buy(\'' + t.from + '\',\'' + Q(t.p) + '\',' + k + ')">' + k + ' (' + htCost(ht, t.from, t.p, k) + ' Cr)</button>'; };
        return '<div class="sa-row" style="border-left:5px solid ' + colOf(t.p.split(' (')[0]) + '"><span class="t"><b>' + E(t.p) + '</b><small>' + t.n + ' vidhayak | ' + (t.from === 'opp' ? 'rival khemma (mehnga)' : 'anya/swatantra (sasta)') + '</small></span><div style="display:flex;gap:6px;flex-wrap:wrap">' + mk(1) + mk(3) + mk(5) + '</div></div>';
    }).join('');
    var body = '<div class="sa-grid2"><div class="sa-panel"><h3>KISKE VIDHAYAK KHARIDOGE? (ROUND ' + ht.round + '/' + ht.rounds + ')</h3>' + (msg ? '<div class="sa-msg' + (msg.bad ? ' bad' : '') + '">' + E(msg.t) + '</div>' : '') + (rows || '<div style="color:#94a3b8">Koi vidhayak nahi bache.</div>') + '</div>' +
        '<div class="sa-panel"><h3>BAHUMAT KA HISAAB</h3><div class="sa-bar maj" style="height:26px"><i style="width:' + (y / ST.n * 100) + '%;background:' + colOf(G.you.main) + '"></i><i style="width:' + ((ST.n - y - o) / ST.n * 100) + '%;background:#64748b"></i><i style="width:' + (o / ST.n * 100) + '%;background:' + colOf(G.opp.main) + '"></i></div>' +
        '<div class="sa-chips"><div class="sa-stat">Aap<b style="color:#4ade80">' + y + '</b></div><div class="sa-stat">Rival<b style="color:#f87171">' + o + '</b></div><div class="sa-stat">Bahumat<b>' + ST.maj + '</b></div><div class="sa-stat">Budget<b>' + Math.round(G.budget) + ' Cr</b></div></div>' +
        '<div style="max-height:150px;overflow:auto;font-size:.8rem;color:#cbd5e1">' + ht.log.slice(0, 8).map(function (l) { return '<div>&#9679; ' + E(l) + '</div>'; }).join('') + '</div>' +
        '<div style="margin-top:12px"><button class="sa-btn" onclick="SAC.htNext()">' + (ht.round >= ht.rounds ? 'FLOOR TEST (VISHWAAS MAT) &rarr;' : 'AGLA ROUND &rarr;') + '</button></div></div></div>';
    showUi('Kharid-Farokht', 'Resort rajniti: 3 round mein bahumat jodo, virodhi bhi tod-phod karega.', body, 'SAC.close()');
}
function htNext() {
    var ht = G.ht;
    var logs = htAiMove();
    if (ht.round >= ht.rounds) { floorTest(); return; }
    ht.round++; saveGame();
    horseScreen(logs.length ? { t: logs[0], bad: true } : null);
}
function floorTest() {
    var res = htFinish(), ht = G.ht, y = htTot(ht, 'you'), o = htTot(ht, 'opp'), msg;
    if (res === 'hung') {
        if (y >= o && Math.random() < 0.55) { res = 'win'; G.result = 'win'; msg = 'Aap sabse bade gathbandhan the; Rajyapal ne bulaya aur vishwaas mat jeet liya!'; }
        else { res = 'lose'; G.result = 'lose'; msg = 'Kisi ke paas bahumat nahi tha; vishwaas mat mein haar hui.'; }
    } else msg = res === 'win' ? 'Floor test mein aapne bahumat sabit kar diya!' : 'Rival ne floor test jeet liya.';
    var body = '<div class="sa-panel" style="max-width:700px;margin:0 auto;text-align:center"><h3>FLOOR TEST</h3><div class="sa-chips" style="justify-content:center"><div class="sa-stat">Aap<b style="color:#4ade80">' + y + '</b></div><div class="sa-stat">Rival<b style="color:#f87171">' + o + '</b></div><div class="sa-stat">Bahumat<b>' + ST.maj + '</b></div></div>' +
        '<div class="sa-verdict ' + (res === 'win' ? 'g' : 'r') + '">' + E(msg) + '</div>' + (res === 'win' ? '<button class="sa-btn" onclick="SAC.formGov(false)">SARKAR BANAO &rarr;</button>' : '<button class="sa-btn gh" onclick="SAC.report()">Report dekho</button>') + '</div>';
    showUi('Vishwaas Mat', ST.name, body, 'SAC.close()');
}

// ---------- CM, cabinet, oath, report ----------
function cmScreen() {
    G.stage = 'cm'; fixG();
    var opts = [], seen = {}, by = youSeats();
    G.you.camp.forEach(function (p, pi) {
        if (pi > 0 && (by[p] || 0) < 1) return;
        leadersOf(p).forEach(function (n, i) { if (!seen[n]) { seen[n] = 1; opts.push({ n: n, p: p, tag: pi === 0 ? (i === 0 ? 'Sabse bada chehra' : 'Varishth neta') : p + ' ka daava (' + (by[p] || 0) + ' seat)' }); } });
    });
    G.cmOpts = opts;
    var cards = opts.map(function (o, i) {
        return '<div class="sa-pk' + (G.cmFace === o.n ? ' sel' : '') + '" style="--c:' + colOf(o.p) + '" onclick="SAC.cm(' + i + ')">' + leaderImg(o.n, o.p, 'sm') + '<div><b>' + E(o.n) + '</b><small>' + E(o.p) + ' | ' + E(o.tag) + '</small>' + (G.cmFace === o.n ? '<br><span class="sa-chip g">Aapka ghoshit chehra</span>' : '') + '</div></div>';
    }).join('');
    showUi('Mukhyamantri Chuno', 'Vidhayak dal ka neta chunega. Saathi dalon ka daava bhi sunna padega.', '<div class="sa-pick">' + cards + '</div>', 'SAC.close()');
}
function depScreen() {
    G.stage = 'dep'; fixG();
    var opts = [], seen = {}, by = youSeats();
    seen[G.cm.name] = 1;
    G.you.camp.forEach(function (p, pi) {
        if (pi > 0 && (by[p] || 0) < 1) return;
        leadersOf(p).forEach(function (n) { if (!seen[n]) { seen[n] = 1; opts.push({ n: n, p: p }); } });
    });
    G.depOpts = opts;
    if (!G.depSel) G.depSel = opts.filter(function (o) { return G.deps.indexOf(o.n) >= 0; }).slice(0, 4);
    drawDep();
}
function drawDep() {
    var sel = {}; G.depSel.forEach(function (d) { sel[d.n] = 1; });
    var cards = G.depOpts.map(function (o, i) {
        return '<div class="sa-pk' + (sel[o.n] ? ' sel' : '') + '" style="--c:' + colOf(o.p) + '" onclick="SAC.depToggle(' + i + ')">' + leaderImg(o.n, o.p, 'sm') + '<div><b>' + E(o.n) + '</b><small>' + E(o.p) + '</small>' + (sel[o.n] ? '<br><span class="sa-chip g">Upmukhyamantri</span>' : '') + '</div></div>';
    }).join('');
    showUi('Upmukhyamantri Chuno', G.cm.name + ' ke saath 0 se 4 upmukhyamantri chuno (' + G.depSel.length + '/4)', '<div class="sa-pick">' + (cards || '<div class="sa-msg">Koi aur neta uplabdh nahi.</div>') + '</div><div style="margin-top:16px"><button class="sa-btn" onclick="SAC.depGo()">MANTRIMANDAL BANAO &rarr;</button></div>', 'SAC.close()');
}
var MINS = ['Grih', 'Vitt', 'Swasthya', 'Shiksha', 'Krishi', 'Sadak Nirman (PWD)', 'Urja', 'Rajasva', 'Nagar Vikas', 'Gramin Vikas', 'Parivahan', 'Samaj Kalyan', 'Udyog', 'Jal Shakti', 'Van evam Paryavaran', 'Mahila evam Bal Vikas'];
function cabPool() {
    if (G.pool) return G.pool;
    var pool = {};
    G.you.camp.forEach(function (p) { var arr = leadersOf(p).slice(), g = 0; while (arr.length < 10 && g++ < 80) { var nm = nameGen(); if (arr.indexOf(nm) < 0) arr.push(nm); } pool[p] = arr; });
    G.pool = pool; return pool;
}
function cabSetup() {
    var m = clamp(Math.round(ST.n / 12), 10, MINS.length), nDep = (G.depSel || []).length;
    G.cabMins = MINS.filter(function (x) { return x !== 'Grih'; }).slice(0, Math.max(3, m - 1 - nDep));
    if (!G.cabSel) { G.cabSel = {}; cabAuto(); }
}
function cabQuota() {
    var by = youSeats(), tot = sumVals(by) || 1, m = G.cabMins.length + 1 + (G.depSel || []).length, q = {};
    G.you.camp.forEach(function (p) { var c = by[p] || 0; q[p] = c ? Math.max(1, Math.round(m * c / tot)) : 0; });
    if (!q[G.cm.party]) q[G.cm.party] = 1;
    return q;
}
function cabAuto() {
    var pool = cabPool(), q = cabQuota(), used = {}, need = {}, list = [];
    used[G.cm.name] = 1; (G.depSel || []).forEach(function (d) { used[d.n] = 1; });
    G.you.camp.forEach(function (p) { need[p] = q[p] || 0; });
    need[G.cm.party]--; (G.depSel || []).forEach(function (d) { need[d.p]--; });
    G.you.camp.forEach(function (p) { for (var i = 0; i < Math.max(0, need[p]); i++) list.push(p); });
    G.cabSel = {};
    G.cabMins.forEach(function (mn, idx) {
        var p = list[idx] || G.you.main, arr = pool[p] || [], nm = null;
        for (var k = 0; k < arr.length; k++) if (!used[arr[k]]) { nm = arr[k]; break; }
        if (!nm) { var g = 0; nm = nameGen(); while (used[nm] && g++ < 30) nm = nameGen(); }
        used[nm] = 1; G.cabSel[idx] = nm + '|' + p;
    });
}
function cabinetScreen() {
    G.stage = 'cabinet'; fixG(); cabSetup(); saveGame();
    var pool = cabPool(), q = cabQuota(), got = {};
    got[G.cm.party] = 1; (G.depSel || []).forEach(function (d) { got[d.p] = (got[d.p] || 0) + 1; });
    Object.keys(G.cabSel).forEach(function (k) { var v = G.cabSel[k]; if (v) { var p = v.split('|')[1]; got[p] = (got[p] || 0) + 1; } });
    var quota = G.you.camp.filter(function (p) { return q[p] > 0; }).map(function (p) { var low = (got[p] || 0) < q[p]; return '<span class="sa-chip' + (low ? ' low' : '') + '" style="border-left:4px solid ' + colOf(p) + '">' + E(p) + ': <b>' + (got[p] || 0) + '/' + q[p] + '</b></span>'; }).join('');
    var rows = G.cabMins.map(function (mn, idx) {
        var cur = G.cabSel[idx] || '', opts = '<option value="">-- chuno --</option>' + G.you.camp.map(function (p) {
            return '<optgroup label="' + E(p) + '">' + (pool[p] || []).filter(function (n) { return n !== G.cm.name && !(G.depSel || []).some(function (d) { return d.n === n; }); }).map(function (n) { var v = n + '|' + p; return '<option value="' + E(v) + '"' + (v === cur ? ' selected' : '') + '>' + E(n) + '</option>'; }).join('') + '</optgroup>';
        }).join('');
        return '<div class="sa-cabr" style="animation-delay:' + (idx * 0.03) + 's"><div><small>Vibhag</small><b>' + E(mn) + '</b></div><select class="sa-select" onchange="SAC.cabSet(' + idx + ',this.value)">' + opts + '</select></div>';
    }).join('');
    var top = '<div class="sa-panel"><h3>MUKHYAMANTRI AUR UPMUKHYAMANTRI</h3><div class="sa-row" style="border-left:5px solid ' + colOf(G.cm.party) + '">' + leaderImg(G.cm.name, G.cm.party, 'sm') + '<span class="t"><small>Mukhyamantri (Grih)</small><b>' + E(G.cm.name) + '</b></span><span>' + E(G.cm.party) + '</span></div>' +
        (G.depSel || []).map(function (d) { return '<div class="sa-row" style="border-left:5px solid ' + colOf(d.p) + '">' + leaderImg(d.n, d.p, 'sm') + '<span class="t"><small>Upmukhyamantri</small><b>' + E(d.n) + '</b></span><span>' + E(d.p) + '</span></div>'; }).join('') + '</div>';
    var body = '<div class="sa-grid2"><div>' + top + '<div class="sa-panel"><h3>SAATHI DALON KA HISSA</h3><div class="sa-quota">' + quota + '</div><div style="color:#94a3b8;font-size:.85rem">Laal = saathi dal ko uske hisse se kam mantri. Naraazgi report mein dikhegi.</div><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="sa-btn gh sm" onclick="SAC.cabAuto()">Auto-bharo</button></div></div></div>' +
        '<div class="sa-panel"><h3>MANTRI KA VIBHAG</h3>' + rows + '<button class="sa-btn" style="margin-top:10px" onclick="SAC.cabDone()">MANTRIMANDAL GHOSHIT KARO &rarr;</button></div></div>';
    showUi('Mantrimandal', G.cm.name + ' ki sarkar: har vibhag ka mantri aap chuno', body, 'SAC.close()');
}
function cabFinal() {
    var q = cabQuota(), pool = cabPool(), used = {}, cab = [{ min: 'Mukhyamantri (Grih)', name: G.cm.name, party: G.cm.party }];
    used[G.cm.name] = 1;
    (G.depSel || []).forEach(function (d) { used[d.n] = 1; cab.push({ min: 'Upmukhyamantri', name: d.n, party: d.p }); });
    var got = {}; cab.forEach(function (c) { got[c.party] = (got[c.party] || 0) + 1; });
    G.cabMins.forEach(function (mn, idx) {
        var v = (G.cabSel[idx] || '').split('|'), nm = v[0], p = v[1];
        if (!nm || used[nm]) { p = G.you.main; var arr = pool[p] || [], k; nm = null; for (k = 0; k < arr.length; k++) if (!used[arr[k]]) { nm = arr[k]; break; } if (!nm) nm = nameGen(); }
        used[nm] = 1; got[p] = (got[p] || 0) + 1; cab.push({ min: mn, name: nm, party: p });
    });
    G.cab = cab; G.mood = {};
    G.you.allies.forEach(function (p) { if (q[p] > 0) G.mood[p] = (got[p] || 0) >= q[p] ? 'santusht' : ((got[p] || 0) >= q[p] - 1 ? 'theek-thaak' : 'naraaz'); });
}
function oathScreen() {
    G.stage = 'oath'; if (!G.cab) cabFinal(); saveGame();
    var rows = G.cab.map(function (c, i) { return '<div class="sa-rs" style="--c:' + colOf(c.party) + ';animation-delay:' + (0.8 + i * 0.12) + 's">' + leaderImg(c.name, c.party, 'sm') + '<span class="t"><b>' + E(c.name) + '</b><small>' + E(c.min) + '</small></span><span style="color:' + colOf(c.party) + '">' + E(c.party) + '</span></div>'; }).join('');
    var mood = Object.keys(G.mood || {}).map(function (p) { var m = G.mood[p]; return '<span class="sa-chip" style="border-left:4px solid ' + colOf(p) + '">' + E(p) + ': <b style="color:' + (m === 'naraaz' ? '#fca5a5' : '#86efac') + '">' + m + '</b></span>'; }).join('');
    showUi('Shapath Grahan', ST.name, '<div class="sa-hero">' + confetti(60) + '<div style="font-size:3.4rem">&#127963;</div><div style="color:#fde68a;font-weight:800;letter-spacing:4px">MUKHYAMANTRI</div><h2>' + E(G.cm.name) + '</h2><div style="color:#cbd5e1">' + E(G.cm.party) + ' | ' + E(ST.name) + '</div><p style="color:#e2e8f0">Raj Bhavan mein shapath-grahan samaroh sampann hua.</p></div>' +
        '<div class="sa-panel" style="margin-top:12px"><h3>MANTRIMANDAL</h3>' + rows + (mood ? '<div class="sa-quota" style="margin-top:10px">' + mood + '</div>' : '') + '<button class="sa-btn" style="margin-top:12px" onclick="SAC.report()">REPORT DEKHO &rarr;</button></div>', 'SAC.close()');
}
// State ka asli natija save: Rajya Sabha aur Rashtrapati chunav ismein se vote ginte hain
function careerPerks() {
    try {
        if (!window.CareerMode || !CareerMode.hasParty() || !G || G.you.main !== CareerMode.getParty().name) return;
        var pk = CareerMode.perks ? CareerMode.perks() : {}, m = G.mod.you;
        if (pk.consult) m.man = Math.min(0.3, 1 - (1 - m.man) * (1 - 0.05));
        if (pk.ecActive) { m.man = Math.min(0.3, 1 - (1 - m.man) * (1 - 0.08)); G.ecPerk = 1; try { localStorage.setItem('rajniti_ec_used', '1'); } catch (e) {} }
        G.judgePerk = !!pk.judge;
        if (window.CareerHub && CareerHub.allTickets) {
            var nm = function (x) { return String(x || '').replace(/ and /g, ' & ').toLowerCase(); };
            CareerHub.allTickets().filter(function (t) { return t.kind === 'MLA' && nm(t.state) === nm(ST.name); }).forEach(function (t) {
                var want = String(t.seat || '').replace(/^\d+\.\s*/, '').toLowerCase(), sNo = null;
                ST.seats.forEach(function (x) { if (String(x.nm).toLowerCase() === want) sNo = x.no; });
                if (sNo) { G.vips.you[sNo] = { name: t.name, won: null }; G.mod.you.vip = G.mod.you.vip || {}; G.mod.you.vip[sNo] = 0.15; }
            });
        }
    } catch (e) {}
}
function stateResultSave() {
    try {
        var all = JSON.parse(localStorage.getItem('rajniti_state_results') || '{}'), seats = {}, add = function (o) { Object.keys(o || {}).forEach(function (k) { seats[k] = (seats[k] || 0) + o[k]; }); }, used = 0;
        add(campSeatsByParty('you')); add(campSeatsByParty('opp'));
        Object.keys(seats).forEach(function (k) { used += seats[k]; });
        if (ST.n > used) seats['Others'] = ST.n - used;
        all[ST.name] = { total: ST.n, seats: seats, date: new Date().toISOString().slice(0, 10) };
        localStorage.setItem('rajniti_state_results', JSON.stringify(all));
    } catch (e) {}
}
// Career Hub se jod: apni career party se khela gaya chunav career mein darj hota hai
function careerReport(win) {
    try {
        if (!window.CareerMode || !CareerMode.hasParty() || !CareerMode.reportStateElection || G.careerReported) return;
        var cp = CareerMode.getParty().name;
        if (G.you.main !== cp) return;
        G.careerReported = true;
        var won = [];
        Object.keys(G.done).forEach(function (no) { var d = G.done[no]; if (d.party === cp) won.push({ no: +no, seat: ST.byNo[no] ? ST.byNo[no].nm : '#' + no }); });
        CareerMode.reportStateElection({ party: cp, state: ST.name, n: ST.n, maj: ST.maj, won: won, campSeats: tallyDone().you, gov: !!win, cm: G.cm ? G.cm.name : '', cmParty: G.cm ? G.cm.party : '', cabinet: (G.cab || []).map(function (c) { return { min: c.min, name: c.name, party: c.party }; }), alliance: campName('you'), mood: G.mood || {}, diff: G.diff });
    } catch (e) { console.warn('career report', e); }
}
function reportScreen() {
    G.stage = 'report'; var t = tallyDone(), win = G.result === 'win';
    var you = G.final ? G.final.you : t.you, pct = you / ST.n, grade = win ? (pct >= 0.6 ? 'S' : (pct >= 0.52 ? 'A' : 'B')) : (pct >= 0.42 ? 'C' : 'D');
    stateResultSave();
    careerReport(win);
    histSave(ST.name, { res: win ? 'win' : 'lose', seats: you, party: G.you.main, date: new Date().toISOString().slice(0, 10) });
    clearSave();
    var body = '<div class="sa-panel"><h3>CHUNAV REPORT</h3><div class="sa-verdict ' + (win ? 'g' : 'r') + '">' + (win ? E(G.cm ? G.cm.name + ' ki sarkar bani' : 'Sarkar bani') : 'Aap sarkar nahi bana paye') + ' | Grade ' + grade + '</div>' +
        '<div class="sa-chips"><div class="sa-stat">Aapke seat<b>' + you + ' / ' + ST.n + '</b></div><div class="sa-stat">Kul kharch<b>' + Math.round(G.spent) + ' Cr</b></div><div class="sa-stat">Phase<b>' + ST.phases.length + '</b></div><div class="sa-stat">Kathinai<b>' + DIFF[G.diff].name + '</b></div></div>' + hemi() +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px"><button class="sa-btn" onclick="SAC.list()">DOOSRA RAJYA</button><button class="sa-btn b" onclick="SAC.again()">YAHI RAJYA DOBARA</button>' + (window.CareerMode && CareerMode.hasParty() && G.you.main === CareerMode.getParty().name ? '<button class=\"sa-btn o\" onclick=\"SAC.toCareer()\">CAREER HUB &rarr;</button>' : '') + '</div></div>';
    showUi('Chunav Report', ST.name, body, 'SAC.list()');
}

// =============================================================
//  EXPORTS + HOOK
// =============================================================
window.SAC = {
    list: openList, close: function () { stopTicker(); if (SA.timer) { clearInterval(SA.timer); SA.timer = null; } uiEl().classList.add('hidden'); warEl().classList.add('hidden'); },
    pickState: pickState, partyScreen: partyScreen, modeScreen: modeScreen, pickParty: pickParty,
    setOpp: function (n) { ensureParty(n); SA.ui.opp = n; SA.ui.partners = SA.ui.partners.filter(function (p) { return p !== n; }); SA.ui.oppAllies = null; modeScreen(); },
    setMode: function (m) { SA.ui.mode = m; if (m === 'alliance' && !SA.ui.partners.length) SA.ui.partners = defaultPartners(); if (m !== 'alliance') SA.ui.partners = []; SA.ui.oppAllies = null; modeScreen(); },
    setDiff: function (d) { SA.ui.diff = d; modeScreen(); },
    rmAlly: function (p) { SA.ui.partners = SA.ui.partners.filter(function (x) { return x !== p; }); modeScreen(); },
    rmOppAlly: function (p) { SA.ui.oppAllies = (SA.ui.oppAllies || []).filter(function (x) { return x !== p; }); modeScreen(); },
    pk: openPicker, pkPick: pkPick, pkClose: pkClose, azq: azq, stq: stq, strg: strg, qset: qset,
    afterMode: afterMode,
    qadd: function (i, d) { var u = SA.ui, p = u.partners[i]; if (p) qset(i, (u.quotas[p] || 0) + d); },
    qfair: function (i) { var u = SA.ui, p = u.partners[i]; if (p) qset(i, defaultQuotas([u.you].concat(u.partners), u.you)[p] || 0); },
    court: function (lid) { var el = document.getElementById('sa-topic'); doAct('ct', (el ? el.value : CASE_TOPICS[0]) + '|' + lid); },
    quotaAuto: function () { SA.ui.quotas = defaultQuotas([SA.ui.you].concat(SA.ui.partners), SA.ui.you); updateShare(); },
    start: startWar, panel: openPanel, closePanel: closePanel, act: doAct, nextRound: nextRound, divFocus: divFocus, pickSeat: pickSeat, exitWar: exitWar,
    afterPhase: afterPhase, counting: countingScreen, countSkip: countSkip, result: resultScreen,
    horse: function () { startHT(); horseScreen(); },
    buy: function (from, p, n) { var r = htBuy(from, p, n); horseScreen({ t: r.text, bad: !r.ok || !r.good }); },
    htNext: htNext,
    formGov: function (direct) { cmScreen(); },
    cm: function (i) { var o = G.cmOpts[i]; G.cm = { name: o.n, party: o.p }; G.depSel = null; G.cabSel = null; G.cab = null; depScreen(); },
    depToggle: function (i) { var o = G.depOpts[i], k = -1; G.depSel.forEach(function (d, j) { if (d.n === o.n) k = j; }); if (k >= 0) G.depSel.splice(k, 1); else if (G.depSel.length < 4) G.depSel.push(o); G.cabSel = null; drawDep(); },
    depGo: function () { G.cabSel = null; cabinetScreen(); },
    cabSet: function (i, v) { Object.keys(G.cabSel).forEach(function (k) { if (v && G.cabSel[k] === v && +k !== i) G.cabSel[k] = ''; }); G.cabSel[i] = v; cabinetScreen(); },
    cabAuto: function () { cabAuto(); cabinetScreen(); },
    cabDone: function () { cabFinal(); oathScreen(); },
    oath: oathScreen, report: reportScreen,
    again: function () { var n = ST.name; clearSave(); pickState(n); },
    resume: function () {
        var sv = loadSave(); if (!sv || !sv.G) return;
        ST = loadState(sv.G.state); if (!ST) return; (sv.G.extra || []).forEach(addExtra);
        G = sv.G; BASE = {}; SA.sel = ST.phases[Math.min(G.phase, ST.phases.length - 1)][0]; SA.selDiv = ST.byNo[SA.sel].div; SA.panel = null; SA.msg = '';
        var s = G.stage;
        if (s === 'phaseResult') phaseResultScreen(G.lastPhase);
        else if (s === 'exitpoll') exitPollScreen();
        else if (s === 'counting') exitPollScreen();
        else if (s === 'result') resultScreen();
        else if (s === 'horse') horseScreen();
        else if (s === 'cm') cmScreen();
        else if (s === 'dep') depScreen();
        else if (s === 'cabinet') cabinetScreen();
        else if (s === 'oath') oathScreen();
        else buildWar();
    },
    careerFight: function (name) {
        if (!window.CareerMode || !CareerMode.hasParty()) return;
        if (availableStates().indexOf(name) < 0) { alert(name + ' ki map file abhi nahi mili.'); return; }
        SA.forceCareer = name; ST = loadState(name); SA.forceCareer = null;
        SA.ui = { diff: 'Normal', mode: 'alone', partners: [], extra: [], oppAllies: null };
        pickParty(CareerMode.getParty().name);
    },
    toCareer: function () { SAC.close(); if (window.CareerMode) CareerMode.open(); },
    dropSave: function () { if (confirm('Adhura game hata dein?')) { clearSave(); openList(); } }
};
// debugging/testing ke liye
window.__SA.internals = { loadState: loadState, newGame: newGame, entityList: entityList, decideSeat: decideSeat, endRound: endRound, nextPhase: nextPhase, execYou: execYou, A: { guru: A_guru, karSeat: A_karSeat, karDiv: A_karDiv, official: A_official, contro: A_contro, rallySeat: A_rallySeat }, getG: function () { return G; }, getST: function () { return ST; }, setST: function (s) { ST = s; }, tallyDone: tallyDone, exitPoll: exitPoll, startHT: startHT, htBuy: htBuy, htAiMove: htAiMove, htFinish: htFinish, cabFinal: cabFinal, autoAlloc: autoAlloc, defaultQuotas: defaultQuotas, oppAlliesFor: oppAlliesFor, setCM: function (c) { G.cm = c; } };

// dashboard: "State Assembly Election" card ab seedha is module ko kholta hai
var _prevOpen = window.openElection;
window.openElection = function (t) {
    if (t === 'state-assembly') { openList(); return; }
    if (typeof _prevOpen === 'function') return _prevOpen.apply(this, arguments);
};
})();
