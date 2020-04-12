package capstone.controller;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.util.bcel.classfile.Constant;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import capstone.model.Project;
import capstone.model.assignment.Task;
// import capstone.model.Deliverable;
// import capstone.model.PeerReview;
import capstone.model.assignment.WeeklyReport;
import capstone.model.users.Student;
import capstone.repository.TaskRepository;
// import capstone.repository.DeliverableRepository;
// import capstone.repository.PeerReviewRepository;
import capstone.repository.WeeklyReportRepository;
import capstone.service.AssignmentService;
import capstone.service.EmailService;
import capstone.service.UserService;
import capstone.util.Constants;

/*
 * This controller is a WIP. Deliverables is likely the closest to fully functional.
 */
@RestController
@RequestMapping("assignment")
public class AssignmentController {
	@Autowired
	private UserService userService;

	@Autowired
	private AssignmentService assignmentService;
	// @Autowired
	// private DeliverableRepository deliverableRepo;

	@Autowired
	private WeeklyReportRepository weeklyRepo;
	@Autowired
	private TaskRepository taskRepo;
	// @Autowired
	// private PeerReviewRepository peerRepo;
	@Autowired
	private EmailService emailService;

	public AssignmentController() {
	 }

	/* Deliverables */

	// @PostMapping("/deliverables/info")
	// @CrossOrigin
	// public void createDeliverableInfo(@RequestBody Deliverable deliverable) {
	// System.out.println(deliverable.name + " " + deliverable.description);
	// deliverableRepo.save(deliverable);
	// }

	// @PostMapping("/deliverables/upload")
	// @CrossOrigin
	// public void createDeliverable(@RequestParam("file") MultipartFile uploadfile)
	// {
	// if (!uploadfile.isEmpty()) {
	// try {
	// saveFile(Arrays.asList(uploadfile));
	// } catch (IOException e) {
	// System.out.println(e.getMessage());
	// }
	// }
	// }

	// @GetMapping("/deliverables/all")
	// @CrossOrigin
	// public Iterable<Deliverable> getAllDeliverables() {
	// return deliverableRepo.findAll();
	// }

	// @GetMapping("/deliverables/{project_number}")
	// @CrossOrigin
	// public Iterable<Deliverable> getDeliverable(@PathVariable("project_number")
	// Long projectNumber) {
	// return deliverableRepo.findAllByProjectId(projectNumber);
	// }

	// @PostMapping("/deliverables/{project_number}/{deliverable_number}/approve")
	// @CrossOrigin
	// public void approveDeliverable(@PathVariable("project_number") Long
	// projectNumber,
	// @PathVariable("deliverable_number") Long deliverableNumber) {
	// deliverableRepo.setStatusForId("Approved", deliverableNumber);
	// System.out.println("Approved!");
	// }

	// @PostMapping("/deliverables/{project_number}/{deliverable_number}/reject")
	// @CrossOrigin
	// public void rejectDeliverable(@PathVariable("project_number") Long
	// projectNumber,
	// @PathVariable("deliverable_number") Long deliverableNumber) {
	// deliverableRepo.setStatusForId("Rejected", deliverableNumber);
	// System.out.println("Rejected :(");
	// }

	// private void saveFile(List<MultipartFile> files) throws IOException {
	// for (MultipartFile file : files) {
	// System.out.println("File received " + file.getOriginalFilename());
	// if (!file.isEmpty()) {
	// byte[] bytes = file.getBytes();
	// }
	// }
	// }
 
	/* Weekly Status Reports */

	@PostMapping("/weeklyReportForm")
	@CrossOrigin
	public @ResponseBody String weeklyReportSubmissionAttempt(@RequestBody Map<String, String> info) {
		System.out.println("Received HTTP POST");
		String timeStamp = new SimpleDateFormat("yyyy:MM:dd:HH:mm:ss").format(new Date());
		//String timeCode = new SimpleDateFormat("MMddHHmmss").format(new Date());

		System.out.println(timeStamp);
		System.out.println(info.get("email"));
		Student s = userService.findStudentByEmail(info.get("email"));
		//Project assigned to student? 
		Project p = userService.getStudentProject(s);

	//	System.out.println(info.get("nextWeekTaskList"));
		WeeklyReport wr = new WeeklyReport();
		wr.setStudent(s);
		wr.setProject(p);
		wr.semester = 2019; 
		wr.setSubmitDateTime(timeStamp);
		wr.setDueDate(info.get("dueDate"));
		ArrayList<Task> thisweekTaskList = new ArrayList<>();
		ArrayList<Task> nextweekTaskList = new ArrayList<>();

		//JSONParser parser = new JSONParser();
		for (Object o : (org.json.simple.JSONArray) JSONValue.parse(info.get("thisWeekTaskList"))) {
			JSONObject task = (JSONObject) o;
			Task t = new Task();
			t.setHours((String) task.get("hours"));
			t.setDescription((String) task.get("description"));
			thisweekTaskList.add(t);
		}
		wr.setThisWeekTasks(thisweekTaskList);
		for (Object o : (org.json.simple.JSONArray) JSONValue.parse(info.get("nextWeekTaskList"))) {
			JSONObject task = (JSONObject) o;
			Task t = new Task();
			t.setHours((String) task.get("hours"));
			t.setDescription((String) task.get("description"));
			//taskRepo.save(t);
			nextweekTaskList.add(t);
		}
		wr.setNextWeekTasks(nextweekTaskList);

		// timeCode.replaceAll(".", "");

		// weeklyreportdata.setId(Integer.parseInt(timeCode));
		//System.out.println(weeklyreportdata.getId());
		// System.out.println(weeklyreportdata.getName());
		// System.out.println(weeklyreportdata.getUscusername());

		// use sql to send this data to weeklyreportstable
		assignmentService.saveAssignment(wr);
		System.out.println("Weekly report saved!");

		/*
		 * String reportConfirmation = weeklyreportdata.getName() +
		 * " submitted a weekly report.\n\n" + "TIME: " + timeStamp + "\n" +
		 * "USC USERNAME: " + weeklyreportdata.getUscusername() + "\n" +
		 * "PROJECT NAME: " + weeklyreportdata.getProject() + "\n\n" +
		 * "For more information, visit the CSCI401 website or reply to this email.";
		 // New development: Suggest sending weekly status updates by email? 
		 * maildriver.sendEmail("Weekly Report Submitted by " +
		 * weeklyreportdata.getName(), reportConfirmation, "csci401server@gmail.com");
		 * maildriver.sendEmail("Weekly Report Confirmation", reportConfirmation,
		 * weeklyreportdata.getUscusername()+"@usc.edu");
		 */

		return Constants.SUCCESS;
	}
	// Stakeholder view of the weekly reports
	@GetMapping("getweeklyreport/{semester}/{fallspring}")
	@CrossOrigin
	public Collection<WeeklyReport> getWeeklyReportsforStakeholder(@PathVariable("semester") int semester, @PathVariable("fallspring") int fallspring)
	{
		List<WeeklyReport> weeklyReports = (List<WeeklyReport>) assignmentService.getWeeklyReports();

		// List<WeeklyReport> validReports = new ArrayList<WeeklyReport>();
		// for (WeeklyReport wr: weeklyReports) {
		// 	//TO DO: parse by Semester
		
		// }
		return weeklyReports; 
	}




	/* Peer Reviews */
	
	// @PostMapping("/peerReviewForm")
	// @CrossOrigin
	// public @ResponseBody PeerReview peerReviewSubmissionAttempt(@RequestBody PeerReview peerreviewdata) {
	// 	System.out.println("Received HTTP POST");
	// 	String timeStamp = new SimpleDateFormat("yyyy:MM:dd:HH:mm:ss").format(new Date());
	// 	String timeCode = new SimpleDateFormat("MMddHHmmss").format(new Date());
	// 	// timeCode.replaceAll(".", "");

	// 	// peerreviewdata.setId(Integer.parseInt(timeCode));
	// 	System.out.println(peerreviewdata.getId());
	// 	System.out.println(peerreviewdata.getUscidnumber());
	// 	System.out.println(peerreviewdata.getUscusername());
	// 	peerRepo.save(peerreviewdata);

	// 	// use sql to send this data to weeklyreportstable
	// 	/*
	// 	 * driver.addPeerReviewEntry(peerreviewdata); mailDriver maildriver = new
	// 	 * mailDriver("csci401server", "drowssap$$$");
	// 	 * 
	// 	 * String reportConfirmation = "A peer review was submitted for " +
	// 	 * peerreviewdata.getTeammateaddress() +".\n\n" + "TIME: " + timeStamp + "\n" +
	// 	 * "USC USERNAME: " + peerreviewdata.getUscusername() + "\n" + "USC ID: " +
	// 	 * peerreviewdata.getUscidnumber() + "\n" + "TEAM MEMBER NAME: " +
	// 	 * peerreviewdata.getTeammateaddress() + "\n" + "POSITIVE FEEDBACK: "+
	// 	 * peerreviewdata.getPositivefeedback() + "\n" + "NEED IMPROVEMENT: " +
	// 	 * peerreviewdata.getNegativefeedback() + "\n\n" +
	// 	 * "For more information, visit the CSCI401 website or reply to this email.";
	// 	 * 
	// 	 * maildriver.sendEmail("Peer Review Submitted for " +
	// 	 * peerreviewdata.getTeammateaddress(), reportConfirmation,
	// 	 * "csci401server@gmail.com"); maildriver.sendEmail("Peer Review Confirmation",
	// 	 * reportConfirmation, peerreviewdata.getUscusername()+"@usc.edu");
	// 	 */

	// 	return peerreviewdata;
	// }
}
