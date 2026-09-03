(function () {
  "use strict";

  const split = (value) => String(value || "").split("|").filter(Boolean);
  const pairSteps = (value) => split(value).map((row) => {
    const parts = row.split("::");
    return { title: parts[0], body: parts[1] || "" };
  });
  const categories = {};
  const category = (id, recordsEn, recordsZh, pathEn, pathZh) => {
    categories[id] = {
      recordsEn: split(recordsEn), recordsZh: split(recordsZh),
      pathEn: pairSteps(pathEn), pathZh: pairSteps(pathZh)
    };
  };

  category("oncology",
    "Pathology report and molecular results|Recent CT, MRI or PET-CT images and reports|Previous surgery, radiotherapy and drug-treatment records|Latest blood tests and organ-function results|Current medicines, allergies and performance status",
    "病理报告与分子检测结果|近期 CT、MRI 或 PET-CT 影像及报告|既往手术、放疗与药物治疗记录|近期血液检查与脏器功能结果|当前用药、过敏史与体能状态",
    "Pathology review::The hospital confirms tumor type, stage and molecular features.|Imaging review::Specialists define disease extent and measurable targets.|Multidisciplinary opinion::Relevant departments compare feasible treatment options.|Plan confirmation::Benefits, risks, schedule and case estimate are documented.|Treatment and follow-up::Response, adverse events and the next review are tracked.",
    "病理复核::医院确认肿瘤类型、分期与分子特征。|影像评估::专科医生明确病灶范围与可评价靶病灶。|多学科会诊::相关科室共同比较可行治疗方案。|方案确认::书面确认预期作用、风险、时间与个案费用。|治疗与随访::持续评估疗效、不良反应与下一次复查。"
  );
  category("cardiac",
    "Cardiology diagnosis and symptom history|ECG, echocardiography and coronary imaging|Recent blood tests and kidney function|Previous catheter or cardiac-surgery reports|Current anticoagulant and cardiac medicines",
    "心血管诊断与症状记录|心电图、超声心动图与冠脉影像|近期血液检查与肾功能|既往介入或心脏手术记录|当前抗凝与心血管用药",
    "Heart-team review::Cardiology, imaging and surgery teams assess the case.|Anatomy testing::Required ultrasound, CT or angiography is confirmed.|Procedure planning::Approach, device and backup strategy are selected.|Treatment::The hospital performs the agreed intervention or operation.|Recovery review::Rhythm, circulation, medicines and activity are reassessed.",
    "心脏团队评估::心内科、影像与外科团队共同评估。|解剖检查::确认所需超声、CT 或造影检查。|术式规划::确定路径、器械与备用方案。|实施治疗::由医院完成确认后的介入或手术。|恢复评估::复查心律、循环、用药与活动能力。"
  );
  category("neurosurgery",
    "Neurological diagnosis and symptom timeline|Brain or spine MRI and CT source images|Vascular imaging or functional tests when available|Previous surgery, biopsy and pathology records|Current neurological medicines and functional status",
    "神经系统诊断与症状时间线|脑或脊柱 MRI、CT 原始影像|已有血管影像或功能检查|既往手术、活检与病理资料|当前神经系统用药与功能状态",
    "Specialist review::Neurology and neurosurgery confirm the clinical question.|Imaging reconstruction::The team maps anatomy, lesions and critical structures.|Treatment conference::Surgery, intervention and non-surgical options are compared.|Procedure::The selected technique is delivered with intraoperative monitoring as needed.|Neurological follow-up::Function, imaging and rehabilitation needs are reviewed.",
    "专科评估::神经内外科确认需要解决的临床问题。|影像重建::标记病灶、解剖结构与重要功能区。|方案讨论::比较手术、介入与非手术方案。|实施治疗::按需结合术中监测完成选定技术。|神经随访::复查功能、影像与康复需求。"
  );
  category("transplant",
    "Organ-failure diagnosis and complete treatment history|Blood type, infection screening and immunology results|Recent imaging and organ-function tests|Donor information when legally applicable|Current medicines and comorbidity records",
    "器官衰竭诊断与完整治疗经过|血型、感染筛查与免疫学结果|近期影像与脏器功能检查|符合法规时提供供者资料|当前用药与合并疾病记录",
    "Eligibility screening::A licensed center reviews indication, contraindications and legal requirements.|Recipient assessment::Organ function, infection and operative risk are evaluated.|Donor pathway review::Where applicable, compatibility and donor safety are assessed independently.|Center decision::The transplant team confirms eligibility, timing and consent requirements.|Long-term monitoring::Immunosuppression, infection and graft function are followed.",
    "适应证初筛::具备资质的中心核对适应证、禁忌证与法规要求。|受者评估::评估脏器功能、感染与手术风险。|供者路径评估::符合法规时独立评估配型与供者安全。|中心决定::移植团队确认资格、时间与知情同意要求。|长期管理::持续监测免疫抑制、感染与移植物功能。"
  );
  category("hematology",
    "Pathology slides or blocks and marrow reports|Flow cytometry, cytogenetic and molecular results|Complete treatment and response history|Recent blood counts, infection and organ-function tests|Donor typing or collection information when relevant",
    "病理切片或蜡块与骨髓报告|流式、细胞遗传与分子检测结果|完整治疗经过与疗效记录|近期血常规、感染与脏器功能检查|相关供者配型或采集资料",
    "Diagnostic confirmation::Hematopathology and molecular data are reviewed together.|Risk classification::The team defines disease status and treatment objective.|Therapy assessment::Drug, cellular and transplant options are compared.|Treatment course::Hospital care includes laboratory and infection monitoring.|Response and continuity::Disease response and the home-country follow-up plan are documented.",
    "诊断确认::综合复核血液病理与分子资料。|风险分层::明确疾病状态与治疗目标。|治疗评估::比较药物、细胞与移植方案。|疗程管理::住院期间同步进行实验室与感染监测。|疗效与交接::记录疾病反应并制定返程随访方案。"
  );
  category("orthopedics",
    "Diagnosis and pain or mobility history|Recent X-ray, CT or MRI source images|Previous operation and implant records|Bone density and relevant blood tests|Current mobility aids and rehabilitation assessment",
    "诊断与疼痛、活动能力记录|近期 X 光、CT 或 MRI 原始影像|既往手术与植入物资料|骨密度与相关血液检查|当前辅具与康复评估",
    "Orthopedic review::The surgeon confirms the pain source, anatomy and treatment goal.|Imaging plan::Alignment, stability and implant or surgical options are measured.|Prehabilitation::Strength, nutrition and postoperative support are prepared.|Procedure::The selected operation or intervention is completed.|Mobilization::Pain control, walking, function and return travel are reassessed.",
    "骨科评估::医生确认疼痛来源、解剖条件与治疗目标。|影像规划::测量力线、稳定性及植入物或术式选择。|术前准备::安排力量、营养与术后支持。|实施治疗::完成确认后的手术或介入。|活动恢复::复评疼痛、行走、功能与返程条件。"
  );
  category("ophthalmology",
    "Eye diagnosis and symptom history|Visual acuity, pressure and slit-lamp findings|OCT, fundus, corneal or biometric imaging|Previous eye operations and lens records|Current eye drops and systemic medicines",
    "眼科诊断与症状记录|视力、眼压与裂隙灯检查|OCT、眼底、角膜或生物测量影像|既往眼科手术与晶体资料|当前眼药与全身用药",
    "Eye examination::The specialist confirms visual function and ocular anatomy.|Imaging and measurements::Required retinal, corneal or lens data are completed.|Technique selection::Procedure, implant and expected visual target are discussed.|Treatment::The hospital performs the agreed operation or intervention.|Vision follow-up::Healing, pressure, imaging and visual recovery are checked.",
    "眼科检查::专科医生确认视觉功能与眼部解剖。|影像与测量::完成所需眼底、角膜或晶体数据。|技术选择::讨论术式、植入物与预期视力目标。|实施治疗::医院完成确认后的手术或治疗。|视力随访::检查愈合、眼压、影像与视力恢复。"
  );
  category("dentistry",
    "Dental diagnosis and treatment goal|Panoramic X-ray and CBCT source images|Periodontal and oral-health records|Previous implant or restorative information|Medicines, allergies and relevant systemic conditions",
    "口腔诊断与治疗目标|口腔全景片与 CBCT 原始影像|牙周与口腔健康记录|既往种植或修复资料|用药、过敏与相关全身疾病",
    "Oral assessment::The team evaluates teeth, gums, bone and bite.|Digital planning::Three-dimensional data support surgery and restoration design.|Preparatory care::Infection, extraction or bone needs are addressed first.|Procedure and restoration::Treatment follows the confirmed staged plan.|Review::Healing, bite, hygiene and return visits are arranged.",
    "口腔评估::检查牙齿、牙周、骨量与咬合。|数字规划::利用三维数据设计手术与修复。|前期处理::先处理感染、拔牙或骨量问题。|治疗与修复::按确认的分期方案实施。|复查::安排愈合、咬合、清洁与复诊。"
  );
  category("rehabilitation",
    "Primary diagnosis and acute-treatment summary|Recent imaging and operation records|Functional, mobility and cognitive assessments|Current medicines, devices and precautions|Home environment and caregiver information",
    "原发疾病诊断与急性期治疗摘要|近期影像与手术记录|功能、活动与认知评估|当前用药、辅具与注意事项|居住环境与照护者信息",
    "Functional assessment::The team establishes a measurable baseline.|Goal setting::Mobility, self-care, pain and participation goals are agreed.|Program design::Therapy intensity, devices and safety limits are set.|Training cycle::Progressive sessions are adjusted using regular reassessment.|Home transition::Exercises, equipment and caregiver guidance are handed over.",
    "功能评估::团队建立可量化的功能基线。|目标制定::确认活动、自理、疼痛与参与目标。|方案设计::确定治疗强度、设备与安全边界。|训练周期::通过定期复评调整渐进训练。|返程衔接::交接训练、设备与照护者指导。"
  );
  category("fertility",
    "Reproductive history and previous cycle records|Hormone, ovarian-reserve and semen results|Pelvic ultrasound or relevant imaging|Genetic reports when available|Current medicines and infectious-disease screening",
    "生殖史与既往周期记录|激素、卵巢储备与精液检查|盆腔超声或相关影像|已有遗传学报告|当前用药与传染病筛查",
    "Reproductive review::The center assesses both partners and the treatment objective.|Cycle planning::Tests, medicines and monitoring dates are aligned.|Laboratory stage::Fertilization, culture or testing follows the approved indication.|Transfer or preservation::The center confirms timing and consent.|Follow-up::Results, medicines and next-stage care are coordinated.",
    "生殖评估::中心评估双方情况与治疗目标。|周期规划::统一安排检查、用药与监测日期。|实验室阶段::按获准适应证进行受精、培养或检测。|移植或保存::由中心确认时间与知情同意。|后续随访::协调结果、用药与下一阶段照护。"
  );
  category("pediatrics",
    "Child's diagnosis and symptom timeline|Growth, vaccination and developmental records|Recent imaging, pathology and laboratory results|Previous treatment and operation records|Current medicines, allergies and parent concerns",
    "儿童诊断与症状时间线|生长、疫苗与发育记录|近期影像、病理与实验室结果|既往治疗与手术记录|当前用药、过敏史与家属诉求",
    "Pediatric review::Age-specific specialists confirm the clinical question.|Family discussion::Options, anesthesia and care needs are explained to guardians.|Child-focused planning::Nutrition, comfort and companion arrangements are integrated.|Treatment::The hospital delivers the agreed pediatric plan.|Recovery and handover::Function, medicines and family guidance are documented.",
    "儿科评估::对应年龄与专科团队确认临床问题。|家属沟通::向监护人说明方案、麻醉与照护需求。|儿童方案::纳入营养、舒适与家属陪同安排。|实施治疗::医院完成确认后的儿科方案。|恢复与交接::记录功能、用药与家庭照护指导。"
  );
  category("tcm",
    "Primary diagnoses and current symptoms|Current prescriptions, supplements and allergies|Recent operation and hospital-discharge records|Relevant imaging and laboratory results|Sleep, appetite, pain and functional goals",
    "主要诊断与当前症状|当前处方、补充剂与过敏史|近期手术与出院记录|相关影像与实验室结果|睡眠、食欲、疼痛与功能目标",
    "Physician assessment::A qualified TCM physician reviews diagnoses, symptoms and medicines.|Safety screening::Bleeding, skin, pregnancy and postoperative risks are checked.|Program selection::Techniques and frequency are matched to the clinical goal.|Treatment course::Response and tolerance are reviewed throughout the program.|Continuity plan::Home exercises, medicines and follow-up are documented.",
    "医生评估::具备资质的中医医生核对诊断、症状与用药。|安全筛查::评估出血、皮肤、妊娠与术后风险。|项目选择::根据临床目标确定技术与频次。|疗程管理::持续复评反应与耐受。|连续照护::记录返程训练、用药与随访安排。"
  );

  const profiles = [];
  const add = (categoryId, id, data) => profiles.push(Object.assign({ category: categoryId, id: id }, data));
  const profile = (categoryId, id, mechanismEn, mechanismZh, candidatesEn, candidatesZh, assessmentEn, assessmentZh, benefitsEn, benefitsZh, limitsEn, limitsZh, risksEn, risksZh, settingEn, settingZh, timingEn, timingZh, teamEn, teamZh) => add(categoryId, id, {
    mechanismEn, mechanismZh,
    candidatesEn: split(candidatesEn), candidatesZh: split(candidatesZh),
    assessmentEn: split(assessmentEn), assessmentZh: split(assessmentZh),
    benefitsEn: split(benefitsEn), benefitsZh: split(benefitsZh),
    limitsEn: split(limitsEn), limitsZh: split(limitsZh),
    risksEn: split(risksEn), risksZh: split(risksZh),
    settingEn, settingZh, timingEn, timingZh, teamEn, teamZh
  });

  profile("oncology", "car-t-cell-therapy",
    "T cells are collected from the patient, engineered to recognize a defined antigen, expanded and returned after lymphodepleting treatment. The cells can then identify and attack cancer cells carrying that target.",
    "采集患者自身 T 细胞，经工程化改造后识别特定抗原，扩增并在淋巴清除治疗后回输，使其识别并攻击携带相应靶点的肿瘤细胞。",
    "Selected relapsed or refractory blood cancers|A confirmed target such as CD19 or BCMA|Patients able to complete collection, bridging care and close monitoring",
    "部分复发或难治性血液肿瘤|确认存在 CD19、BCMA 等相应靶点|能够完成采集、桥接治疗与密切监测的患者",
    "Pathology, target expression and disease burden|Previous treatment response and available alternatives|Heart, lung, kidney, liver, infection and neurological status",
    "病理、靶点表达与疾病负荷|既往治疗反应与其他可选方案|心肺、肝肾、感染与神经系统状态",
    "A personalized treatment directed at a defined tumor target|May produce deep responses in selected blood cancers|Can be considered after several prior therapies",
    "针对明确肿瘤靶点的个体化治疗|部分血液肿瘤可获得较深缓解|可在多线既往治疗后进行评估",
    "Only applies to selected diagnoses and targets|Cell production takes time and may not succeed|Long-term follow-up and local continuity are required",
    "仅适用于部分诊断与靶点|细胞制备需要时间且可能无法完成|需要长期随访并与本国医疗衔接",
    "Cytokine-release syndrome|Neurological toxicity|Serious infection and prolonged low blood counts",
    "细胞因子释放综合征|神经系统毒性|严重感染与长期血细胞减少",
    "Specialist inpatient center", "专科中心住院治疗", "Several weeks, case-specific", "通常需数周，按个案确定", "Hematology and cellular-therapy team", "血液科与细胞治疗团队"
  );
  profile("oncology", "sbrt",
    "SBRT combines three-dimensional imaging, immobilization and image guidance to deliver a high radiation dose to a small target with steep dose fall-off around nearby tissue.",
    "SBRT 结合三维影像、体位固定与影像引导，将较高剂量精准集中于较小靶区，并使周围组织剂量快速下降。",
    "Selected small, clearly defined tumors|Some early-stage cancers or limited metastatic lesions|Patients whose target can be positioned and monitored accurately",
    "部分体积较小、边界清晰的肿瘤|部分早期肿瘤或有限转移病灶|靶区能够被准确定位与监测的患者",
    "Tumor size, location and movement with breathing|Previous radiation dose and nearby critical organs|Treatment objective and other local or systemic options",
    "肿瘤大小、位置与呼吸运动|既往放疗剂量及邻近重要器官|治疗目标与其他局部或全身方案",
    "Shorter course than conventional fractionation in selected cases|High conformality around a defined target|Non-invasive local treatment",
    "部分病例疗程较常规分割更短|对明确靶区具有较高适形度|非侵入性的局部治疗",
    "Not suitable for every size or location|Still requires strict positioning and follow-up|Does not replace systemic treatment when systemic disease is present",
    "并非适合所有大小或位置|仍需严格定位与后续复查|存在全身性疾病时不能替代系统治疗",
    "Inflammation or injury in nearby organs|Fatigue and site-specific reactions|Delayed radiation effects",
    "邻近器官炎症或损伤|疲劳与照射部位反应|迟发性放射反应",
    "Outpatient radiotherapy", "门诊放射治疗", "Often 1–5 sessions after planning", "完成计划后常为 1–5 次治疗", "Radiation oncology and medical physics", "放疗科与医学物理团队"
  );
  profile("oncology", "proton-heavy-ion-therapy",
    "Charged particles deposit much of their energy at a planned depth. This physical property can reduce exit dose; heavy ions also have different biological effects that may matter for selected tumors.",
    "带电粒子可在计划深度集中释放能量，从而减少出口剂量；重离子还具有不同的生物学效应，可用于评估部分肿瘤。",
    "Tumors close to sensitive organs where dose reduction may matter|Selected pediatric or previously irradiated cases|Tumors whose pathology and geometry fit a particle plan",
    "邻近重要器官且减少正常组织剂量具有价值的肿瘤|部分儿童或既往接受过放疗的病例|病理与几何条件适合粒子计划的肿瘤",
    "Pathology, stage and treatment objective|Comparison with photon radiotherapy plans|Target motion, previous radiation and organ constraints",
    "病理、分期与治疗目标|与光子放疗计划的对比|靶区运动、既往照射与器官剂量限制",
    "Potentially lower dose to selected normal tissues|Precise depth-dose distribution|An additional radiotherapy option for selected complex sites",
    "可降低部分正常组织受照剂量|具有精准的深度剂量分布|为部分复杂部位增加一种放疗选择",
    "Clinical advantage is case-specific|Access, planning and cost can be substantial|Movement and anatomy changes require careful management",
    "临床优势需按个案比较|设备资源、计划与费用要求较高|呼吸运动及解剖变化需要严格管理",
    "Site-specific radiation injury|Fatigue and skin or mucosal reactions|Uncertainty when anatomy changes during treatment",
    "照射部位相关放射损伤|疲劳及皮肤或黏膜反应|疗程中解剖变化带来的不确定性",
    "Specialist particle center", "粒子治疗专科中心", "Planning plus a multi-session course", "计划制定后进行多次治疗", "Radiation oncologist, physicist and dosimetrist", "放疗医生、物理师与剂量师"
  );

  profile("cardiac", "tavr",
    "A biological replacement valve is delivered by catheter, commonly through a leg artery, and expanded inside the diseased aortic valve without open replacement of the native valve.",
    "通过导管将生物瓣膜送入体内，通常经腿部动脉到达主动脉瓣，并在病变瓣膜内展开，无需常规开胸置换原瓣膜。",
    "Severe symptomatic aortic stenosis confirmed by imaging|Patients assessed by a multidisciplinary heart team|Anatomy suitable for transcatheter access and valve sizing",
    "影像确诊的重度症状性主动脉瓣狭窄|经多学科心脏团队评估的患者|血管入路与瓣膜尺寸适合导管治疗",
    "Valve severity, symptoms and life expectancy|Aortic-root and vascular anatomy on CT|Surgical risk, frailty, kidney function and coronary disease",
    "瓣膜严重程度、症状与预期寿命|CT 评估主动脉根部与血管解剖|外科风险、衰弱、肾功能与冠心病",
    "Avoids conventional open valve replacement in selected patients|Smaller access route and earlier mobilization may be possible|Valve function improves immediately when deployment is successful",
    "部分患者可避免常规开胸瓣膜置换|入路较小并可能更早活动|成功释放后可立即改善瓣膜功能",
    "Not every valve anatomy is suitable|Long-term device considerations differ by age and anatomy|Open surgery may still be the better option",
    "并非所有瓣膜解剖都适用|不同年龄与解剖条件下长期器械因素不同|部分患者外科手术仍更合适",
    "Bleeding, vascular injury or stroke|Conduction disturbance requiring a pacemaker|Valve leak, kidney injury or infection",
    "出血、血管损伤或卒中|传导异常并可能需要起搏器|瓣周漏、肾损伤或感染",
    "Cardiac catheter laboratory", "心导管室", "Several days plus recovery review", "通常数日并需恢复评估", "Structural heart team", "结构性心脏病团队"
  );
  profile("cardiac", "pci-with-ivus-oct",
    "PCI opens a narrowed coronary artery with balloons and usually a stent. IVUS or OCT images the vessel from inside to measure plaque, vessel size, expansion and edge results.",
    "PCI 通过球囊及通常使用的支架开通狭窄冠脉；IVUS 或 OCT 从血管内部成像，用于评估斑块、管径、支架扩张与边缘结果。",
    "Selected coronary narrowing causing ischemia or symptoms|Complex lesions where intravascular imaging may improve planning|Patients whose anatomy and clinical status support catheter treatment",
    "部分造成缺血或症状的冠脉狭窄|血管内影像有助于规划的复杂病变|解剖与临床状态适合导管治疗的患者",
    "Symptoms, ischemia and coronary anatomy|Bleeding risk, kidney function and contrast exposure|Choice of medical therapy, PCI or bypass surgery",
    "症状、缺血证据与冠脉解剖|出血风险、肾功能与造影剂暴露|药物、介入或搭桥手术的选择",
    "Detailed lesion and stent assessment|Can guide device sizing and optimization|Minimally invasive coronary revascularization",
    "精细评估病变与支架状态|辅助器械尺寸选择与术后优化|以微创方式完成冠脉血运重建",
    "Imaging is an adjunct, not a guarantee of outcome|Some anatomy is better treated surgically|Requires antiplatelet treatment after stenting",
    "血管内影像是辅助工具，不能保证结果|部分解剖条件更适合外科治疗|支架术后需要抗血小板治疗",
    "Bleeding or vascular complications|Coronary dissection, clot or heart attack|Contrast-related kidney injury",
    "出血或血管并发症|冠脉夹层、血栓或心肌梗死|造影剂相关肾损伤",
    "Cardiac catheter laboratory", "心导管室", "Usually a short admission", "通常为短期住院", "Interventional cardiology team", "心血管介入团队"
  );
  profile("cardiac", "hybrid-cardiac-surgery",
    "A hybrid strategy combines catheter-based intervention and cardiac surgery, either during one procedure or in planned stages, to address different parts of a complex heart condition.",
    "杂交策略将导管介入与心脏外科手术结合，可在同次治疗或计划分期中处理复杂心脏疾病的不同问题。",
    "Selected complex coronary, valve or congenital conditions|Cases where one method alone has important limitations|Patients reviewed jointly by surgery and interventional teams",
    "部分复杂冠脉、瓣膜或先心病|单一技术存在明显限制的病例|经外科与介入团队共同评估的患者",
    "Exact lesions addressed by each technique|Sequence, anesthesia and emergency backup|Overall operative risk and recovery capacity",
    "各项技术分别处理的具体病变|实施顺序、麻醉与应急备用方案|整体手术风险与恢复能力",
    "Combines complementary techniques in one plan|May reduce surgical extent in selected cases|One heart team manages the complete strategy",
    "在同一方案中整合互补技术|部分病例可减少外科创伤范围|由同一心脏团队管理完整策略",
    "Requires a specialized hybrid team and operating environment|Benefits depend strongly on anatomy and sequencing|May still involve major surgery and intensive care",
    "需要专业杂交团队与复合手术环境|获益高度依赖解剖与实施顺序|仍可能涉及大手术与重症监护",
    "Bleeding, infection or stroke|Heart rhythm and organ complications|Risks related to both surgery and catheter intervention",
    "出血、感染或卒中|心律及其他脏器并发症|同时存在外科与导管治疗相关风险",
    "Hybrid operating room", "复合手术室", "Case-specific admission and recovery", "按个案确定住院与恢复时间", "Cardiac surgery and interventional team", "心外科与介入联合团队"
  );

  profile("neurosurgery", "neuronavigation",
    "Neuronavigation registers preoperative imaging to the patient's anatomy and gives the surgeon real-time spatial guidance during selected brain or spine procedures.",
    "神经导航将术前影像与患者解剖进行配准，在部分脑部或脊柱手术中为医生提供实时空间定位。",
    "Selected brain tumors, biopsies or deep lesions|Spine procedures requiring precise level or trajectory planning|Operations where image-based orientation can support access",
    "部分脑肿瘤、活检或深部病灶|需要精准节段或路径规划的脊柱手术|影像定位有助于入路选择的手术",
    "MRI or CT quality and registration accuracy|Relationship to vessels and functional structures|Whether intraoperative imaging or monitoring is also needed",
    "MRI 或 CT 质量与配准精度|病灶与血管、功能结构的关系|是否还需术中影像或监测",
    "Supports trajectory and boundary orientation|Can reduce unnecessary exposure in selected operations|Integrates imaging into surgical workflow",
    "辅助规划路径与边界定位|部分手术可减少不必要暴露|将影像信息整合到术中流程",
    "Navigation cannot replace surgical judgment|Brain shift or anatomy change can reduce accuracy|Not required for every operation",
    "不能替代医生的术中判断|脑移位或解剖变化会影响精度|并非所有手术都需要使用",
    "Standard risks of the underlying operation|Registration or equipment error|Injury to nearby neurological structures",
    "原手术本身相关风险|配准或设备误差|邻近神经结构损伤",
    "Operating theatre", "手术室", "Aligned with the planned operation", "随手术方案确定", "Neurosurgeon and imaging team", "神经外科与影像团队"
  );
  profile("neurosurgery", "dbs",
    "DBS places electrodes in selected deep-brain targets and connects them to an implanted pulse generator. Adjustable stimulation modulates circuits involved in movement symptoms.",
    "DBS 将电极植入特定深部脑区并连接脉冲发生器，通过可调节电刺激调控与运动症状相关的神经环路。",
    "Selected Parkinson's disease, essential tremor or dystonia|Persistent disabling symptoms despite optimized medicines|Patients able to complete neuropsychological and surgical assessment",
    "部分帕金森病、特发性震颤或肌张力障碍|规范药物治疗后仍有明显功能障碍|能够完成神经心理与手术评估的患者",
    "Diagnosis, medicine response and symptom pattern|Cognition, mood, imaging and anesthesia risk|Target selection and realistic functional goals",
    "诊断、药物反应与症状类型|认知、情绪、影像与麻醉风险|靶点选择与合理的功能目标",
    "Adjustable and reversible stimulation|Can improve selected motor symptoms|Programming can be refined over time",
    "刺激参数可调且可关闭|可改善部分运动症状|术后可持续调整程控参数",
    "Does not cure the underlying disease|Some symptoms respond poorly|Requires ongoing programming and device follow-up",
    "不能治愈原发疾病|部分症状反应有限|需要持续程控与设备随访",
    "Bleeding, infection or stroke|Mood, speech, balance or cognitive effects|Hardware movement, failure or battery replacement",
    "出血、感染或卒中|情绪、语言、平衡或认知影响|硬件移位、故障或电池更换",
    "Inpatient surgery with outpatient programming", "住院手术与门诊程控", "Surgery plus repeated programming", "手术后需多次程控", "Movement-disorder and neurosurgery team", "运动障碍与神经外科团队"
  );
  profile("neurosurgery", "endovascular-treatment",
    "A microcatheter is guided through blood vessels to treat selected aneurysms, vascular malformations or blocked arteries using coils, stents, flow diverters or thrombectomy devices.",
    "经血管送入微导管，使用弹簧圈、支架、血流导向装置或取栓器械处理部分动脉瘤、血管畸形或闭塞血管。",
    "Selected intracranial aneurysms or vascular malformations|Some acute or planned cerebrovascular conditions|Anatomy suitable for catheter access and device treatment",
    "部分颅内动脉瘤或血管畸形|部分急性或计划性脑血管疾病|血管入路与解剖适合导管及器械治疗",
    "Vessel anatomy on CTA, MRA or angiography|Rupture status, urgency and neurological condition|Need for antiplatelet therapy and alternative surgery",
    "CTA、MRA 或造影显示的血管解剖|是否破裂、紧急程度与神经状态|抗血小板治疗需求与外科替代方案",
    "Treats lesions from inside the vessel|Avoids open surgery in selected cases|Multiple device strategies can be compared",
    "从血管内部处理病变|部分病例可避免开颅手术|可比较多种器械策略",
    "Some anatomy is unsuitable or needs open surgery|Imaging follow-up remains necessary|Retreatment may be required",
    "部分解剖不适用或需外科手术|仍需影像随访|可能需要再次治疗",
    "Stroke, bleeding or vessel injury|Contrast reaction or kidney injury|Clotting or device-related complications",
    "卒中、出血或血管损伤|造影剂反应或肾损伤|血栓或器械相关并发症",
    "Neurointerventional suite", "神经介入导管室", "Short admission or emergency pathway", "短期住院或急诊路径", "Neurointerventional and stroke team", "神经介入与卒中团队"
  );

  profile("transplant", "living-donor-assessment",
    "Independent donor and recipient pathways examine compatibility, organ anatomy, long-term donor health, informed consent and legal eligibility before any living-donor procedure is considered.",
    "供者与受者采用独立评估路径，核对配型、器官解剖、供者长期健康、知情同意与法律资格后，才可能考虑活体捐献。",
    "Potential legally eligible related donors|Recipients with a confirmed transplant indication|Families able to complete independent medical and psychosocial review",
    "可能符合法律要求的亲属供者|已确认具有移植适应证的受者|能够完成独立医学与心理社会评估的家庭",
    "Compatibility, anatomy and organ function|Voluntary consent without coercion|Donor's lifetime health risk and alternative options",
    "配型、解剖与脏器功能|自愿且无胁迫的知情同意|供者终身健康风险与其他选择",
    "Provides a structured safety assessment|Clarifies compatibility and surgical anatomy|Separates donor welfare from recipient decision-making",
    "建立系统性安全评估|明确配型与手术解剖|将供者权益与受者决策分别评估",
    "Passing tests does not guarantee approval|Legal and ethical rules are strict|Donation creates lifelong health considerations",
    "通过检查不代表一定获批|法律与伦理要求严格|捐献会带来长期健康影响",
    "Procedure and anesthesia risks for the donor|Psychological or family pressure|Long-term reduction in organ reserve",
    "供者手术与麻醉风险|心理或家庭压力|长期脏器储备减少",
    "Licensed transplant center", "具备资质的移植中心", "Multi-stage assessment", "多阶段评估", "Independent donor and transplant teams", "独立供者与移植团队"
  );
  profile("transplant", "transplant-surgery",
    "A failing organ is replaced through major surgery followed by intensive monitoring and lifelong immunosuppression. The exact pathway depends on organ type, lawful availability and recipient status.",
    "通过大型手术置换衰竭脏器，术后进行重症监测并长期使用免疫抑制药物。具体路径取决于器官类型、合法来源与受者状态。",
    "Patients with end-stage organ failure and a confirmed indication|Recipients without prohibitive infection or operative risk|Cases accepted by a licensed transplant center",
    "终末期脏器衰竭且适应证明确的患者|无不可接受感染或手术风险的受者|获具备资质移植中心接收的病例",
    "Urgency, organ function and comorbidities|Infection, malignancy and immune compatibility|Legal allocation, informed consent and long-term adherence",
    "紧急程度、脏器功能与合并疾病|感染、肿瘤与免疫相容性|合法分配、知情同意与长期依从性",
    "Can restore organ function in selected end-stage disease|Delivered by a dedicated multidisciplinary program|Structured postoperative and lifelong monitoring",
    "可为部分终末期疾病恢复脏器功能|由专门多学科团队实施|具有系统的术后与终身监测",
    "Organ availability and timing cannot be promised|Major surgery and lifelong medicines are required|Some patients remain ineligible after assessment",
    "无法承诺器官来源与时间|需要大型手术与终身用药|部分患者评估后仍不符合条件",
    "Rejection, infection or graft failure|Bleeding, thrombosis and organ complications|Long-term effects of immunosuppression",
    "排斥、感染或移植物功能衰竭|出血、血栓与脏器并发症|免疫抑制药物的长期影响",
    "Transplant ward and intensive care", "移植病房与重症监护", "Extended, case-specific stay", "较长住院，按个案确定", "Licensed transplant multidisciplinary team", "具备资质的移植多学科团队"
  );
  profile("transplant", "post-transplant-monitoring",
    "Long-term monitoring balances immunosuppression against rejection, infection, drug toxicity and graft function using scheduled tests, medicine levels and specialist review.",
    "长期管理通过定期检查、药物浓度监测与专科复诊，在免疫抑制、排斥、感染、药物毒性及移植物功能之间维持平衡。",
    "Recent transplant recipients needing structured follow-up|Patients with medicine-level or graft-function concerns|International patients requiring handover between treating teams",
    "需要系统随访的近期移植受者|药物浓度或移植物功能存在问题的患者|需要跨国医疗团队交接的国际患者",
    "Graft function and trend over time|Immunosuppressant levels, interactions and adherence|Signs of rejection, infection or metabolic complications",
    "移植物功能及其变化趋势|免疫抑制剂浓度、相互作用与依从性|排斥、感染或代谢并发症迹象",
    "Detects complications earlier|Supports safer medicine adjustment|Creates continuity between hospital and home physician",
    "有助于较早发现并发症|支持更安全地调整用药|建立医院与本国医生之间的连续照护",
    "Monitoring cannot eliminate rejection or infection|Testing schedules differ by organ and time since surgery|Urgent deterioration needs local emergency care",
    "监测不能消除排斥或感染|检查频率取决于器官及术后时间|急性恶化需立即使用当地急救",
    "Drug toxicity and interactions|Opportunistic infection|Delayed recognition if testing is missed",
    "药物毒性与相互作用|机会性感染|未按时检查导致延迟识别",
    "Outpatient and laboratory follow-up", "门诊与实验室随访", "Long-term scheduled reviews", "长期定期复查", "Transplant physician and pharmacist", "移植医生与临床药师"
  );

  profile("hematology", "cellular-therapy",
    "Cellular therapies use immune or blood-derived cells that are selected, expanded or modified for a defined therapeutic purpose. The product, target and pathway vary by diagnosis.",
    "细胞治疗根据明确治疗目标选择、扩增或改造免疫细胞及血液来源细胞；所用产品、靶点与治疗路径随疾病诊断而变化。",
    "Selected blood cancers with a relevant target or trial pathway|Patients whose disease status allows collection and treatment|Cases reviewed by a qualified cellular-therapy center",
    "具有相关靶点或研究路径的部分血液肿瘤|疾病状态允许采集与治疗的患者|经具备能力的细胞治疗中心评估的病例",
    "Confirmed pathology and molecular target|Prior therapies, disease tempo and bridging options|Organ function, infection status and product availability",
    "明确的病理与分子靶点|既往治疗、疾病进展速度与桥接方案|脏器功能、感染状态与产品可及性",
    "Uses a defined cellular mechanism|May add an option after standard treatments|Delivered with specialist monitoring",
    "利用明确的细胞作用机制|可为标准治疗后的部分患者增加选择|在专科监测下实施",
    "Evidence and availability differ by product|Manufacturing or collection may delay treatment|Only selected diagnoses are eligible",
    "不同产品的证据与可及性不同|制备或采集可能延长等待时间|仅部分诊断符合条件",
    "Immune reactions or neurological effects|Infection and low blood counts|Product failure or insufficient response",
    "免疫反应或神经系统影响|感染与血细胞减少|制备失败或疗效不足",
    "Specialist inpatient center", "专科中心住院治疗", "Several weeks, product-specific", "通常数周，随产品确定", "Hematology and cellular-therapy team", "血液科与细胞治疗团队"
  );
  profile("hematology", "stem-cell-transplant",
    "Hematopoietic stem-cell transplant replaces or restores blood-forming cells after conditioning treatment. Cells may come from the patient or a matched donor depending on the disease.",
    "造血干细胞移植在预处理后重建或恢复造血系统，细胞可来源于患者本人或匹配供者，具体取决于疾病类型。",
    "Selected leukemia, lymphoma, myeloma or marrow disorders|Patients with a disease status that supports transplant|A suitable autologous collection or donor pathway",
    "部分白血病、淋巴瘤、骨髓瘤或骨髓疾病|疾病状态支持移植的患者|具备自体采集或合适供者路径",
    "Disease risk and response before transplant|Donor match, antibodies and cell-source options|Heart, lung, liver, kidney and infection risk",
    "移植前疾病风险与治疗反应|供者配型、抗体与细胞来源选择|心肺、肝肾与感染风险",
    "Can consolidate remission in selected diseases|Replaces diseased or damaged blood-forming cells|Creates a structured long-term disease-control pathway",
    "可巩固部分疾病的缓解状态|替换病变或受损的造血细胞|建立长期疾病控制路径",
    "High-intensity treatment and long recovery|Donor availability may limit options|Long-term monitoring is essential",
    "治疗强度高且恢复周期长|供者条件可能限制选择|必须进行长期监测",
    "Severe infection and organ toxicity|Graft-versus-host disease in donor transplant|Graft failure, relapse or infertility",
    "严重感染与脏器毒性|异基因移植的移植物抗宿主病|植入失败、复发或生育力影响",
    "Protected transplant unit", "移植层流病房", "Extended stay and follow-up", "较长住院与随访", "Transplant hematology team", "血液移植团队"
  );
  profile("hematology", "precision-diagnostics",
    "Morphology, flow cytometry, cytogenetics and molecular testing are integrated to classify a blood disorder, identify treatment targets and measure residual disease.",
    "综合形态学、流式细胞术、细胞遗传学与分子检测，对血液疾病进行分型、识别治疗靶点并监测微小残留病。",
    "New or uncertain blood-disorder diagnoses|Cases requiring pathology or marrow re-review|Patients whose treatment depends on molecular classification",
    "新诊断或诊断不明确的血液疾病|需要病理或骨髓复核的病例|治疗依赖分子分型的患者",
    "Sample quality and disease burden|Which tests change treatment decisions|Comparison with previous samples and treatment response",
    "样本质量与疾病负荷|哪些检测会改变治疗决策|与既往样本及治疗反应的比较",
    "More precise classification|Can identify actionable markers|Supports measurable response monitoring",
    "提高疾病分型精度|可识别具有治疗意义的标志物|支持量化疗效监测",
    "No single test answers every question|Some findings have uncertain significance|Results must be interpreted with clinical context",
    "单项检测无法回答所有问题|部分结果意义尚不明确|必须结合临床背景解释",
    "Sampling discomfort or bleeding|False reassurance from limited samples|Incidental genetic findings",
    "取样不适或出血|有限样本可能造成判断偏差|偶然发现遗传学信息",
    "Laboratory and outpatient assessment", "实验室与门诊评估", "Days to several weeks by test", "根据检测需数日至数周", "Hematopathology and molecular team", "血液病理与分子诊断团队"
  );

  profile("orthopedics", "robotic-joint-replacement",
    "Preoperative imaging and digital planning define bone cuts, implant size and alignment. A robotic system then assists the surgeon within the planned boundaries during replacement.",
    "通过术前影像与数字规划确定截骨、假体尺寸及力线，术中机器人系统在规划边界内辅助医生完成关节置换。",
    "Selected advanced hip or knee joint disease|Persistent pain and disability after non-operative care|Anatomy suitable for the available robotic platform",
    "部分晚期髋或膝关节疾病|保守治疗后仍有明显疼痛与功能障碍|解剖条件适合现有机器人平台",
    "Pain source, deformity and remaining function|Bone quality, implant choice and alignment target|Surgical fitness and rehabilitation capacity",
    "疼痛来源、畸形与现有功能|骨质、假体选择与力线目标|手术耐受与康复能力",
    "Consistent execution of a digital plan|Detailed implant positioning measurements|Can support soft-tissue balancing in selected systems",
    "更稳定地执行数字化规划|精细测量假体位置|部分系统可辅助软组织平衡",
    "Clinical value varies by patient and platform|The surgeon remains responsible for all decisions|Does not remove the need for rehabilitation",
    "临床价值随患者与平台不同|所有决策仍由手术医生负责|不能替代术后康复",
    "Infection, clot or bleeding|Nerve, vessel or bone injury|Implant wear, loosening or dislocation",
    "感染、血栓或出血|神经、血管或骨损伤|假体磨损、松动或脱位",
    "Orthopedic operating theatre", "骨科手术室", "Admission plus early rehabilitation", "住院并进行早期康复", "Joint surgeon and rehabilitation team", "关节外科与康复团队"
  );
  profile("orthopedics", "minimally-invasive-spine-surgery",
    "Smaller corridors, tubular retractors, endoscopy or percutaneous fixation may be used to decompress nerves or stabilize the spine while limiting tissue disruption in selected cases.",
    "通过较小通道、管状牵开器、内镜或经皮固定，在部分病例中完成神经减压或脊柱稳定，并减少组织损伤。",
    "Selected disc, stenosis or instability conditions|Symptoms that correlate with imaging findings|Patients whose anatomy permits a limited surgical corridor",
    "部分椎间盘、狭窄或不稳疾病|症状与影像表现相符|解剖允许采用有限手术通道的患者",
    "Neurological findings and pain generator|Spinal alignment, stability and number of levels|Whether wider decompression or fusion is required",
    "神经体征与疼痛来源|脊柱力线、稳定性与涉及节段|是否需要更广泛减压或融合",
    "Smaller incision in selected operations|May reduce soft-tissue disruption|Can support earlier mobilization",
    "部分术式切口较小|可减少软组织损伤|有助于较早活动",
    "Not suitable for every deformity or multilevel disease|Limited access can restrict visualization|Long-term outcome still depends on diagnosis and rehabilitation",
    "并非适合所有畸形或多节段疾病|有限通道可能限制视野|长期结果仍取决于诊断与康复",
    "Nerve injury, dural tear or weakness|Infection, bleeding or clot|Incomplete relief, instability or reoperation",
    "神经损伤、硬膜撕裂或无力|感染、出血或血栓|缓解不足、不稳或再次手术",
    "Spine operating theatre", "脊柱手术室", "Short admission to several weeks of recovery", "短期住院并需数周恢复", "Spine surgeon and rehabilitation team", "脊柱外科与康复团队"
  );
  profile("orthopedics", "integrated-rehabilitation",
    "An integrated program connects surgical precautions with pain control, mobility, strength, balance and daily-function training before and after orthopedic treatment.",
    "一体化康复将骨科治疗前后的手术注意事项、疼痛控制、活动、力量、平衡与日常功能训练衔接起来。",
    "Patients preparing for joint or spine surgery|People recovering from orthopedic operations or trauma|Patients with measurable mobility and independence goals",
    "准备接受关节或脊柱手术的患者|骨科手术或创伤恢复期患者|具有明确活动与自理目标的患者",
    "Weight-bearing and movement restrictions|Pain, strength, balance and fall risk|Home setting, caregiver support and return-travel needs",
    "负重与活动限制|疼痛、力量、平衡与跌倒风险|居住环境、照护支持与返程需求",
    "Links rehabilitation to the surgical plan|Tracks measurable functional goals|Supports a safer transition home",
    "使康复与手术方案保持一致|追踪可量化的功能目标|支持更安全地返程居家",
    "Progress varies with diagnosis and participation|Cannot correct a structural problem by itself|Some goals require a longer course",
    "进展随诊断与参与程度不同|不能单独纠正结构性问题|部分目标需要更长疗程",
    "Falls or overuse injury|Pain flare or wound stress|Cardiovascular events in higher-risk patients",
    "跌倒或过度训练损伤|疼痛加重或伤口受力|高风险患者的心血管事件",
    "Inpatient and outpatient rehabilitation", "住院与门诊康复", "Daily or scheduled multi-week program", "每日或按计划进行数周", "Orthopedic rehabilitation team", "骨科康复团队"
  );

  profile("ophthalmology", "femtosecond-cataract-surgery",
    "A femtosecond laser can create selected corneal incisions, open the lens capsule and fragment the cloudy lens before the surgeon removes it and implants an artificial lens.",
    "飞秒激光可辅助制作部分角膜切口、打开晶状体前囊并预先劈碎混浊晶体，随后由医生清除晶体并植入人工晶体。",
    "Selected patients with visually significant cataract|Eyes with measurements suitable for laser docking|Patients who understand lens choices and realistic visual goals",
    "部分影响视力的白内障患者|眼部测量适合激光对接|充分了解晶体选择与合理视力目标的患者",
    "Cornea, pupil, retina and optic nerve health|Biometry and artificial-lens calculation|Whether conventional cataract surgery is equally appropriate",
    "角膜、瞳孔、视网膜与视神经健康|生物测量与人工晶体计算|常规白内障手术是否同样适用",
    "Automates selected surgical steps|Precise capsulotomy and lens fragmentation|Can be combined with selected astigmatism management",
    "自动完成部分手术步骤|精准制作囊膜切口并劈碎晶体|可结合部分散光处理",
    "Does not guarantee spectacle independence|Not suitable for every eye|Adds equipment and cost without equal benefit in all cases",
    "不能保证完全脱离眼镜|并非适合所有眼部条件|增加设备与费用但并非所有病例获益相同",
    "Infection, inflammation or pressure change|Retinal swelling or detachment|Lens-position or refractive error",
    "感染、炎症或眼压变化|视网膜水肿或脱离|晶体位置或屈光误差",
    "Day-surgery eye center", "眼科日间手术中心", "Procedure plus early follow-up", "手术并进行早期复查", "Cataract surgeon and optometry team", "白内障外科与视光团队"
  );
  profile("ophthalmology", "retinal-microsurgery",
    "Vitrectomy and microsurgical instruments allow the surgeon to remove vitreous traction, repair retinal tissue, control bleeding or place gas or silicone oil when indicated.",
    "玻璃体切除与显微器械可用于解除玻璃体牵拉、修复视网膜、控制出血，并在需要时填充气体或硅油。",
    "Selected retinal detachment, macular or vitreous disease|Vision-threatening bleeding or traction|Patients whose imaging supports a surgical target",
    "部分视网膜脱离、黄斑或玻璃体疾病|威胁视力的出血或牵拉|影像显示存在明确手术靶点的患者",
    "Retinal anatomy on OCT and fundus imaging|Lens status, pressure and the other eye|Need for positioning, tamponade and later removal",
    "OCT 与眼底影像显示的视网膜解剖|晶体、眼压与对侧眼情况|术后体位、填充物与后续取出需求",
    "Direct treatment of retinal or vitreous pathology|Modern small-gauge instruments|Can preserve or improve vision in selected conditions",
    "直接处理视网膜或玻璃体病变|采用现代微创器械|部分疾病可保护或改善视力",
    "Visual recovery may be slow or incomplete|Postoperative positioning can be demanding|Some conditions recur or need further surgery",
    "视力恢复可能缓慢或不完全|术后体位要求较高|部分疾病会复发或需要再次手术",
    "Infection, bleeding or pressure change|Cataract or retinal redetachment|Gas-related travel restrictions",
    "感染、出血或眼压变化|白内障或视网膜再次脱离|眼内气体带来的旅行限制",
    "Retinal surgery center", "眼底外科中心", "Surgery plus position-specific recovery", "手术后按体位要求恢复", "Retinal surgeon and imaging team", "眼底外科与影像团队"
  );
  profile("ophthalmology", "corneal-transplantation",
    "Damaged corneal tissue is replaced with donor tissue. Full-thickness or layer-selective techniques are chosen according to which part of the cornea is diseased.",
    "使用供体角膜替换受损组织；医生根据角膜病变所在层次选择全层或分层移植技术。",
    "Selected corneal scarring, edema or endothelial failure|Disease not adequately managed with other treatments|Patients able to follow prolonged medicine and review schedules",
    "部分角膜瘢痕、水肿或内皮功能衰竭|其他治疗无法充分控制的疾病|能够长期用药并按时复查的患者",
    "Affected corneal layer and visual potential|Surface disease, infection and glaucoma risk|Donor availability and technique-specific prognosis",
    "受损角膜层次与视力潜力|眼表疾病、感染与青光眼风险|供体可及性与不同术式预后",
    "Replaces diseased corneal tissue|Layer-selective surgery can preserve healthy tissue|May restore corneal clarity in selected eyes",
    "替换病变角膜组织|分层手术可保留健康组织|部分眼睛可恢复角膜透明度",
    "Donor availability affects timing|Vision may take months to stabilize|Lifelong rejection awareness is needed",
    "供体可及性影响时间|视力稳定可能需要数月|需长期警惕排斥反应",
    "Rejection, infection or graft failure|Astigmatism, pressure change or suture problems|Need for repeat transplantation",
    "排斥、感染或移植物衰竭|散光、眼压变化或缝线问题|可能需要再次移植",
    "Specialist corneal center", "角膜专科中心", "Availability and technique-specific", "随供体与术式确定", "Corneal surgeon and eye-bank team", "角膜外科与眼库团队"
  );

  profile("dentistry", "digital-implant-planning",
    "CBCT imaging and an intraoral scan are combined to plan implant position, angulation and the future restoration. A surgical guide may transfer the plan to treatment.",
    "将 CBCT 与口内扫描数据结合，规划种植体位置、角度与最终修复体，并可使用导板将数字计划转移到手术。",
    "Patients missing one or more teeth|Adequate bone or a feasible grafting plan|Stable periodontal and general health",
    "缺失一颗或多颗牙齿的患者|骨量充足或具备可行植骨方案|牙周与全身健康稳定",
    "Bone volume, nerves and sinus anatomy|Gum health, bite and restorative space|Smoking, diabetes, medicines and healing capacity",
    "骨量、神经与上颌窦解剖|牙周健康、咬合与修复空间|吸烟、糖尿病、用药与愈合能力",
    "Connects surgery with the final restoration|Improves visualization of anatomy|Can support guided placement in selected cases",
    "使种植手术与最终修复保持一致|更清晰地观察解剖结构|部分病例可实施导板辅助植入",
    "Digital planning does not remove surgical uncertainty|Bone or soft-tissue grafting may still be needed|Multiple visits may be required",
    "数字规划不能消除手术不确定性|仍可能需要骨或软组织增量|可能需要多次就诊",
    "Infection, bleeding or failed integration|Nerve or sinus injury|Restoration fracture or bite problems",
    "感染、出血或骨结合失败|神经或上颌窦损伤|修复体断裂或咬合问题",
    "Dental surgery clinic", "口腔种植诊室", "Staged visits over several months", "通常需数月分期就诊", "Implant surgeon and prosthodontist", "种植外科与修复团队"
  );
  profile("dentistry", "all-on-4-restoration",
    "A fixed full-arch prosthesis is supported by four or more strategically positioned implants. Temporary teeth may be fitted early when stability and clinical conditions allow.",
    "使用四颗或更多按计划分布的种植体支持固定式全牙弓修复；当初期稳定性与临床条件允许时，可较早安装临时牙。",
    "Selected patients missing most or all teeth in one arch|Bone and bite suitable for a full-arch design|Patients able to maintain hygiene and return for staged restoration",
    "单颌大部分或全部牙齿缺失的部分患者|骨量与咬合适合全牙弓设计|能够维护清洁并完成分期修复的患者",
    "Bone distribution and implant stability|Smile, speech, bite and prosthetic space|Need for extraction, grafting or temporary restoration",
    "骨量分布与种植体稳定性|笑线、发音、咬合与修复空间|拔牙、植骨或临时修复需求",
    "Fixed full-arch restoration|Fewer implants than some traditional full-arch plans|Can shorten the period without teeth in selected cases",
    "提供固定式全牙弓修复|种植体数量可少于部分传统全口方案|部分病例可缩短无牙期",
    "Not a same-day final result|Repair and maintenance remain necessary|Loss of one implant can affect the full-arch plan",
    "并非当天完成最终修复|仍需维修与长期维护|单颗种植体失败可能影响整套方案",
    "Implant failure or infection|Prosthesis fracture and bite problems|Speech, hygiene or adaptation difficulties",
    "种植体失败或感染|修复体断裂与咬合问题|发音、清洁或适应困难",
    "Dental surgical and restorative clinic", "口腔外科与修复诊室", "Several staged visits", "需要多次分期就诊", "Implant and prosthodontic team", "种植与修复联合团队"
  );
  profile("dentistry", "maxillofacial-surgery",
    "Oral and maxillofacial surgery treats selected jaw, facial, salivary, trauma and oral conditions using imaging-based surgical planning and reconstructive techniques when needed.",
    "口腔颌面外科借助影像规划及必要的重建技术，处理部分颌骨、面部、唾液腺、创伤与口腔疾病。",
    "Selected jaw tumors, deformity, trauma or complex oral disease|Cases requiring coordinated dental and surgical planning|Patients fit for anesthesia and postoperative nutrition support",
    "部分颌骨肿瘤、畸形、创伤或复杂口腔疾病|需要口腔与外科联合规划的病例|能够接受麻醉与术后营养支持的患者",
    "Pathology, airway and three-dimensional anatomy|Bite, speech, swallowing and reconstructive needs|Dental preparation, nutrition and rehabilitation",
    "病理、气道与三维解剖|咬合、发音、吞咽与重建需求|口腔准备、营养与康复",
    "Addresses complex functional and structural problems|Digital planning can support reconstruction|Multiple specialties can be coordinated in one plan",
    "处理复杂的功能与结构问题|数字规划可辅助重建|可在同一方案中协调多个专科",
    "May involve major surgery and visible recovery|Function can take time to recover|Some plans require staged dental reconstruction",
    "可能涉及大型手术与明显恢复期|功能恢复需要时间|部分方案需分期完成口腔重建",
    "Bleeding, infection or airway problems|Nerve injury, numbness or bite change|Speech, swallowing or wound complications",
    "出血、感染或气道问题|神经损伤、麻木或咬合改变|发音、吞咽或伤口并发症",
    "Maxillofacial operating theatre", "口腔颌面手术室", "Case-specific admission and recovery", "按个案确定住院与恢复", "Maxillofacial, dental and reconstruction team", "颌面外科、口腔与重建团队"
  );

  profile("rehabilitation", "robotic-gait-training",
    "A robotic or electromechanical system supports repeated stepping with adjustable body-weight support, speed and assistance while therapists monitor posture and movement quality.",
    "机器人或机电系统通过可调节的减重、速度与辅助力度支持重复步行训练，并由治疗师持续观察姿势与动作质量。",
    "Selected stroke, spinal-cord, brain-injury or orthopedic recovery|Patients able to tolerate upright repetitive training|People with measurable walking and transfer goals",
    "部分卒中、脊髓、脑损伤或骨科恢复患者|能够耐受直立重复训练的患者|具有明确步行与转移目标的人群",
    "Strength, joint range, balance and cardiovascular tolerance|Spasticity, skin, bone and weight-bearing restrictions|How robotic sessions combine with overground practice",
    "力量、关节活动、平衡与心肺耐力|痉挛、皮肤、骨骼与负重限制|机器人训练与地面训练如何结合",
    "High-repetition task practice|Adjustable assistance and unloading|Objective session data can support reassessment",
    "提供高重复度任务训练|辅助程度与减重可调|客观训练数据可支持复评",
    "Transfer to everyday walking is not automatic|Requires active therapist supervision|Not suitable for unstable medical or skeletal conditions",
    "训练效果不会自动转化为日常步行|需要治疗师全程监督|病情或骨骼不稳定时不适用",
    "Falls or harness pressure injury|Fatigue, pain or cardiovascular stress|Skin irritation or joint overload",
    "跌倒或吊带压伤|疲劳、疼痛或心血管负荷|皮肤刺激或关节过载",
    "Rehabilitation gym", "康复训练中心", "Repeated sessions over several weeks", "通常需数周重复训练", "Physiatrist and physical therapist", "康复医生与物理治疗师"
  );
  profile("rehabilitation", "neuromodulation",
    "Non-invasive electrical or magnetic stimulation targets selected neural pathways and is paired with rehabilitation tasks to support motor, pain or cognitive goals in appropriate patients.",
    "无创电刺激或磁刺激作用于特定神经通路，并与康复任务结合，用于支持部分患者的运动、疼痛或认知目标。",
    "Selected neurological rehabilitation or chronic pain plans|Patients with a defined functional target|Cases without device, seizure or medical contraindications",
    "部分神经康复或慢性疼痛方案|具有明确功能目标的患者|无器械、癫痫或其他医学禁忌的病例",
    "Diagnosis, target and evidence for the intended outcome|Implants, seizure history, pregnancy and skin status|How stimulation is paired with active rehabilitation",
    "诊断、刺激靶点与目标相关证据|植入物、癫痫史、妊娠与皮肤状况|刺激如何与主动康复结合",
    "Non-invasive and adjustable|Can complement task-based therapy|Provides another option for selected symptoms",
    "无创且参数可调|可补充任务导向训练|为部分症状增加一种选择",
    "Response varies and may be modest|Usually requires repeated sessions|Does not replace active rehabilitation or disease treatment",
    "个体反应不同且改善可能有限|通常需要多次治疗|不能替代主动康复或原发病治疗",
    "Headache, tingling or skin irritation|Rare seizure risk with selected techniques|Temporary symptom or mood changes",
    "头痛、麻刺感或皮肤刺激|部分技术存在罕见癫痫风险|短暂症状或情绪变化",
    "Outpatient rehabilitation clinic", "门诊康复中心", "A scheduled course with reassessment", "按疗程安排并定期复评", "Rehabilitation physician and therapist", "康复医生与治疗师"
  );
  profile("rehabilitation", "hydrotherapy",
    "Buoyancy reduces effective body weight while water resistance and temperature support graded mobility, balance and strength work under therapist supervision.",
    "水的浮力降低有效负重，水阻与温度可在治疗师监督下支持渐进的活动、平衡与力量训练。",
    "Selected orthopedic or neurological recovery|Patients who benefit from reduced-load movement|Stable wounds, circulation and cardiopulmonary status",
    "部分骨科或神经康复患者|适合低负荷活动训练的人群|伤口、循环与心肺状态稳定",
    "Wound and infection status|Heart, lung, blood-pressure and continence considerations|Entry, exit and fall-safety needs",
    "伤口与感染状态|心肺、血压与排泄控制情况|入水、出水与防跌倒需求",
    "Reduced joint loading|Water resistance supports graded strengthening|A controlled setting for balance practice",
    "减少关节负荷|利用水阻进行渐进力量训练|在受控环境中练习平衡",
    "Pool gains must transfer to land-based activity|Not suitable with open wounds or unstable disease|Requires accessible facilities and supervision",
    "水中能力仍需转化到陆地活动|开放伤口或疾病不稳定时不适用|需要合适设施与专业监督",
    "Slip, fall or overexertion|Skin or waterborne infection|Breathing or circulation problems",
    "滑倒、跌落或过度运动|皮肤或水源感染|呼吸或循环问题",
    "Therapeutic pool", "治疗性水疗池", "Repeated supervised sessions", "需多次监督训练", "Aquatic physical therapist", "水疗物理治疗师"
  );

  profile("fertility", "ivf-icsi",
    "IVF fertilizes eggs with sperm in the laboratory; ICSI injects a selected sperm into an egg when clinically indicated. Embryos are cultured before transfer or freezing.",
    "IVF 在实验室中使卵子与精子受精；有临床指征时，ICSI 将选定精子注入卵子。胚胎培养后进行移植或冷冻。",
    "Selected tubal, ovulatory, male-factor or unexplained infertility|Patients with adequate reproductive assessment|Couples who meet the center's clinical and regulatory requirements",
    "部分输卵管、排卵、男性因素或不明原因不孕|已完成充分生殖评估的患者|符合中心临床与法规要求的夫妻",
    "Age, ovarian reserve and semen findings|Uterine cavity, health risks and previous cycles|Expected response, embryo strategy and number transferred",
    "年龄、卵巢储备与精液结果|宫腔情况、健康风险与既往周期|预期反应、胚胎策略与移植数量",
    "Established assisted-reproduction pathway|ICSI can address selected fertilization problems|Embryos may be frozen for later use",
    "成熟的辅助生殖路径|ICSI 可处理部分受精问题|胚胎可冷冻后续使用",
    "Success is not guaranteed and declines with some age factors|Often requires repeated visits or cycles|Regulatory eligibility must be confirmed",
    "不能保证成功，部分年龄因素会降低成功率|通常需要多次就诊或周期|必须确认法规资格",
    "Ovarian hyperstimulation and procedure complications|Multiple pregnancy or miscarriage|Emotional, financial and scheduling burden",
    "卵巢过度刺激与取卵并发症|多胎妊娠或流产|情绪、费用与时间负担",
    "Reproductive medicine center", "生殖医学中心", "One monitored cycle plus follow-up", "一个监测周期并需随访", "Reproductive physician and embryology team", "生殖医生与胚胎实验室团队"
  );
  profile("fertility", "pgt",
    "A small number of cells are sampled from an IVF embryo and tested for selected chromosomal or genetic conditions before an embryo is considered for transfer.",
    "从 IVF 胚胎中取少量细胞，对特定染色体或遗传问题进行检测，再评估胚胎是否进入移植选择。",
    "Couples with selected inherited-disease risks|Some chromosome-rearrangement or recurrent-loss cases|Patients with a valid clinical and regulatory indication",
    "存在部分遗传病风险的夫妻|部分染色体重排或反复流产病例|具有明确临床及法规适应证的患者",
    "Exact genetic diagnosis and family results|Whether a validated test can answer the question|Number and quality of available embryos",
    "明确的遗传诊断与家系结果|是否存在可回答问题的有效检测|可用胚胎数量与质量",
    "Can reduce transfer of embryos with a tested condition|Supports informed embryo selection|Connects genetic counseling with IVF planning",
    "可降低移植携带已检测问题胚胎的概率|支持更充分的胚胎选择|将遗传咨询与 IVF 规划衔接",
    "Does not test every disease or guarantee a healthy baby|Mosaic or inconclusive results can occur|Requires IVF even without infertility",
    "不能检测所有疾病，也不能保证健康出生|可能出现嵌合或无法判定结果|即使没有不孕也需要完成 IVF",
    "Embryo biopsy or freezing loss|Misinterpretation without genetic counseling|Emotional and ethical complexity",
    "胚胎活检或冷冻损失|缺少遗传咨询可能误解结果|情绪与伦理复杂性",
    "IVF and genetics laboratory", "生殖与遗传实验室", "IVF cycle plus testing time", "IVF 周期并增加检测时间", "Reproductive genetics and embryology team", "生殖遗传与胚胎团队"
  );
  profile("fertility", "fertility-preservation",
    "Eggs, sperm, embryos or selected reproductive tissue are collected and cryopreserved before a treatment, age-related decline or other risk may affect future fertility.",
    "在治疗、年龄变化或其他风险可能影响未来生育力前，采集并冷冻保存卵子、精子、胚胎或部分生殖组织。",
    "Patients preparing for gonadotoxic cancer or medical treatment|People facing surgery that may affect reproductive function|Selected patients planning elective preservation after counseling",
    "准备接受可能损伤生育力的肿瘤或其他治疗患者|拟行可能影响生殖功能手术的人群|经咨询后选择计划性保存的部分患者",
    "Urgency and time before primary treatment|Age, ovarian reserve or semen quality|Which material can legally and clinically be stored",
    "主要治疗前的紧迫程度与可用时间|年龄、卵巢储备或精液质量|依法且临床可保存的材料类型",
    "Preserves a future reproductive option|Can be coordinated before selected treatments|Storage separates current care from later family planning",
    "为未来保留一种生殖选择|可在部分治疗前协调完成|通过冷冻保存衔接当前治疗与未来生育计划",
    "Stored material does not guarantee a future pregnancy|Time may limit collection options|Long-term storage rules and costs apply",
    "保存材料不能保证未来妊娠|时间紧迫可能限制采集选择|需遵循长期保存规则并承担费用",
    "Collection or stimulation complications|Delay to urgent primary treatment|Loss or non-viability after thawing",
    "采集或促排相关并发症|可能延误紧急的主要治疗|解冻后损失或无法使用",
    "Reproductive preservation unit", "生育力保存中心", "Days to one cycle by method", "根据方式需数日至一个周期", "Reproductive and treating-specialty team", "生殖科与原治疗专科团队"
  );

  profile("pediatrics", "pediatric-mdt",
    "A pediatric MDT brings the relevant child-health specialties together to review one case, reconcile findings and issue a coordinated diagnostic or treatment opinion.",
    "儿童多学科会诊汇集相关儿童专科，对同一病例共同复核资料、统一判断，并形成协调后的诊断或治疗意见。",
    "Children with complex or multisystem conditions|Cases with uncertain diagnosis or competing treatment options|Families seeking a consolidated specialist opinion",
    "复杂或多系统疾病儿童|诊断不明确或存在多种治疗选择的病例|希望获得整合专科意见的家庭",
    "Completeness and quality of records|Which specialties need to participate|Urgency, developmental needs and family goals",
    "资料的完整性与质量|需要参与的专科范围|紧急程度、发育需求与家庭目标",
    "One coordinated review across specialties|Can reduce fragmented recommendations|Creates a clearer next-step plan for the family",
    "由多个专科完成一次整合评估|减少相互割裂的建议|为家庭形成更清晰的下一步方案",
    "An MDT opinion may still require in-person tests|Consensus is not always possible|Availability depends on the required specialists",
    "会诊后仍可能需要现场检查|各专科不一定总能形成一致意见|时间取决于所需专家档期",
    "Delay if urgent care waits for a planned meeting|Incomplete records can misdirect discussion|Family expectations may exceed available evidence",
    "急症等待计划会诊可能造成延误|资料不完整可能影响讨论|家庭预期可能超过现有证据",
    "Multidisciplinary consultation", "多学科会诊", "Scheduled after records are complete", "资料完整后预约", "Pediatric specialty panel", "儿童专科会诊团队"
  );
  profile("pediatrics", "minimally-invasive-surgery",
    "Pediatric laparoscopy, thoracoscopy or other small-access techniques use child-sized instruments and imaging to perform selected operations through smaller incisions.",
    "儿童腹腔镜、胸腔镜等微创技术使用适合儿童的器械与影像，通过较小切口完成部分手术。",
    "Selected abdominal, thoracic or urologic conditions|Children whose size and anatomy support minimally invasive access|Stable cases reviewed by a pediatric surgical team",
    "部分腹部、胸部或泌尿系统疾病|体型与解剖适合微创入路的儿童|经儿童外科团队评估的稳定病例",
    "Age, weight, anatomy and disease severity|Anesthesia, airway and previous operations|When conversion to open surgery may be required",
    "年龄、体重、解剖与疾病严重程度|麻醉、气道与既往手术|何种情况下可能转为开放手术",
    "Smaller incisions in selected operations|May support earlier mobility and feeding|Magnified view of the operative field",
    "部分手术切口较小|可能有助于较早活动与进食|放大观察手术区域",
    "Not suitable for every child or emergency|Technical complexity varies with size|Open surgery may still be safest",
    "并非适合所有儿童或急症|技术难度随体型而变化|开放手术有时更安全",
    "Bleeding, infection or organ injury|Anesthesia and breathing complications|Conversion to open surgery or reoperation",
    "出血、感染或脏器损伤|麻醉与呼吸并发症|转为开放手术或再次手术",
    "Pediatric operating theatre", "儿童手术室", "Procedure-specific admission", "按术式确定住院时间", "Pediatric surgery and anesthesia team", "儿童外科与麻醉团队"
  );
  profile("pediatrics", "family-centered-recovery",
    "Family-centered recovery integrates guardians into communication, comfort, nutrition, rehabilitation and home-care training while the clinical team manages the child's treatment.",
    "家庭参与式康复将监护人纳入沟通、安抚、营养、康复与居家照护训练，同时由临床团队负责儿童治疗。",
    "Children recovering from surgery or complex illness|Families needing structured caregiver education|Cases with nutrition, mobility or developmental goals",
    "手术或复杂疾病恢复期儿童|需要系统照护培训的家庭|具有营养、活动或发育目标的病例",
    "Child's developmental level and comfort needs|Guardian availability and learning needs|Medical precautions, nutrition and home environment",
    "儿童发育水平与安抚需求|监护人的时间与学习需求|医疗注意事项、营养与居住环境",
    "Keeps caregivers informed and prepared|Supports consistent routines for the child|Connects hospital recovery with home care",
    "帮助照护者充分了解并做好准备|为儿童保持一致的照护节奏|衔接医院恢复与居家照护",
    "Family participation cannot replace clinical staff|Caregiver burden must be monitored|Home resources may limit parts of the plan",
    "家庭参与不能替代临床人员|需要关注照护者负担|家庭资源可能限制部分方案",
    "Incorrect home technique without training|Caregiver fatigue or anxiety|Delayed escalation when symptoms worsen",
    "培训不足导致居家操作错误|照护者疲劳或焦虑|症状加重时延迟就医",
    "Ward and rehabilitation setting", "病房与康复场景", "Throughout admission and discharge", "贯穿住院与出院", "Pediatric, nursing and rehabilitation team", "儿科、护理与康复团队"
  );

  profile("tcm", "acupuncture",
    "A qualified practitioner inserts sterile single-use needles at selected points. Technique, depth, stimulation and frequency are chosen after a TCM and medical safety assessment.",
    "具备资质的专业人员在选定穴位使用一次性无菌针具，针法、深度、刺激与频次由中医及医学安全评估后确定。",
    "Selected pain, nausea or functional rehabilitation goals|Patients with a physician-defined supportive-care plan|People without uncontrolled bleeding or infection risk",
    "部分疼痛、恶心或功能康复目标|具有医生制定的辅助照护方案|无未控制出血或感染风险的人群",
    "Primary diagnosis and current treatment|Anticoagulants, platelet count and infection risk|Skin condition, pregnancy and tolerance",
    "原发疾病与当前治疗|抗凝药、血小板与感染风险|皮肤情况、妊娠与耐受",
    "Can complement selected symptom or rehabilitation plans|Technique and frequency are adjustable|Usually delivered without medication",
    "可辅助部分症状或康复方案|技术与频次可调整|通常无需使用药物",
    "Response varies by condition and person|Does not replace indicated medical treatment|Repeated sessions may be needed",
    "效果随疾病与个体不同|不能替代必要的医学治疗|可能需要重复治疗",
    "Bruising, pain or fainting|Bleeding or infection|Rare injury if anatomy and technique are inappropriate",
    "瘀青、疼痛或晕针|出血或感染|解剖与操作不当时的罕见损伤",
    "TCM outpatient clinic", "中医门诊", "Individual sessions within a course", "按疗程安排单次治疗", "Qualified TCM physician", "具备资质的中医医生"
  );
  profile("tcm", "moxibustion",
    "Moxibustion applies controlled heat from burning or electrically heated moxa near selected points. It is used as a supportive technique within a physician-defined plan.",
    "艾灸使用燃烧或电加热艾材，在选定穴位附近施加可控温热刺激，作为医生方案中的辅助技术。",
    "Selected supportive-care or musculoskeletal goals|Patients whose skin and sensation allow safe heat exposure|People assessed by a qualified TCM physician",
    "部分辅助照护或肌肉骨骼目标|皮肤与感觉能够安全接受温热刺激的患者|经具备资质中医医生评估的人群",
    "Skin integrity, sensation and circulation|Respiratory sensitivity to smoke|Fever, pregnancy and current medical treatment",
    "皮肤完整性、感觉与循环|对烟雾的呼吸道敏感性|发热、妊娠与当前医学治疗",
    "Non-invasive controlled heat technique|Can be combined with selected TCM programs|Session intensity can be adjusted",
    "非侵入性的可控温热技术|可与部分中医方案结合|治疗强度可调整",
    "Evidence and response vary by indication|Smoke-free methods may still create heat risk|Cannot replace primary treatment",
    "不同适应证的证据与反应不同|无烟方式仍存在热损伤风险|不能替代主要治疗",
    "Burns, blistering or skin irritation|Smoke-related discomfort or allergy|Delayed medical care if used in place of treatment",
    "烫伤、水疱或皮肤刺激|烟雾相关不适或过敏|替代正规治疗造成就医延误",
    "TCM outpatient clinic", "中医门诊", "Short sessions within a course", "按疗程安排短时治疗", "Qualified TCM physician", "具备资质的中医医生"
  );
  profile("tcm", "tuina-rehabilitation",
    "Tuina uses clinician-delivered manual techniques and may be paired with movement, stretching and functional training after medical and musculoskeletal assessment.",
    "推拿由专业人员实施手法治疗，并可在医学与肌肉骨骼评估后结合活动、牵伸与功能训练。",
    "Selected musculoskeletal pain or movement limitations|Some rehabilitation programs after medical clearance|Patients able to tolerate manual pressure and movement",
    "部分肌肉骨骼疼痛或活动受限|经医学许可的部分康复方案|能够耐受手法压力与活动的患者",
    "Recent surgery, fracture and bone health|Neurological signs, pain source and movement tolerance|Anticoagulation, skin and inflammatory conditions",
    "近期手术、骨折与骨骼健康|神经体征、疼痛来源与活动耐受|抗凝、皮肤与炎症情况",
    "Hands-on assessment and treatment|Can be combined with active exercise|Techniques can be adjusted to tolerance",
    "结合手法评估与治疗|可与主动训练结合|技术可按耐受调整",
    "Manual therapy alone may not change structural disease|Not suitable for unstable injury or red-flag symptoms|Progress depends on active rehabilitation",
    "单纯手法不能改变结构性疾病|损伤不稳或存在危险症状时不适用|进展依赖主动康复参与",
    "Pain flare, bruising or soft-tissue injury|Nerve or vascular aggravation|Delayed diagnosis if serious symptoms are overlooked",
    "疼痛加重、瘀青或软组织损伤|神经或血管问题加重|忽视严重症状导致延迟诊断",
    "TCM and rehabilitation clinic", "中医与康复门诊", "Repeated sessions with reassessment", "多次治疗并定期复评", "TCM physician and rehabilitation therapist", "中医医生与康复治疗师"
  );

  window.HUAYIAN_TECHNOLOGY_CATEGORIES = categories;
  window.HUAYIAN_TECHNOLOGY_DETAILS = profiles.reduce((result, item) => {
    result[item.id] = item;
    return result;
  }, {});
})();
