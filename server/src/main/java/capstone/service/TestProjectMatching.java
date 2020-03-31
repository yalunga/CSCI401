// // package capstone.service;

// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.List;

// // import org.junit.Test;
// // import org.springframework.beans.factory.annotation.Autowired;

// // import capstone.model.Project;
// // import capstone.model.users.Student;


// // public class TestProjectMatching {
// // 	@Autowired
// // 	ProjectService ps;
// // 	UserService us;
	
// 	@Test
// 	public void testAlgorithm() {
// 		System.out.println("TEST ALGORITHM");
// 		ps = new ProjectService();
// 		ps.initTables();
// 		List<Project> alg = ps.runAlgorithm();
// 		Collections.sort(alg);
// 		ArrayList<Integer> listOfStudents = new ArrayList<Integer>();
// 		for (Project p : alg) {
// 			if (p.members.size() == 0) continue;
// 			System.out.println("Project " + p.getProjectId());
// 			System.out.print("Students:");
// 			for (Student s: p.getMembers()) {
// 				listOfStudents.add(Integer.parseInt(s.getLastName()));
// 				System.out.print(" "+s.getLastName());
// 			}
// 			System.out.println("");
// 		}
// 		System.out.println("LIST OF STUDENTS: ");
// 		int j = 1;
// 		Collections.sort(listOfStudents);
// 		ArrayList<Integer> unassignedStudents = new ArrayList<Integer>();
// 		ArrayList<Integer> duplicates = new ArrayList<Integer>();
// 		for (Integer i : listOfStudents) {
// 			if (i != j) {
// 				unassignedStudents.add(j);
// 				j++;
				
// 			}
// 			if (duplicates.contains(i)) {
// 				System.out.println("DUPLICATE");
// 			}
// 			System.out.print(i + " ");
// 			if (!duplicates.contains(i)) duplicates.add(i);
			
// 			j++;
// 		}
// 		System.out.println("");
		
// //		System.out.println("UNASSIGNED STUDENTS: ");
// //		for (Integer i : unassignedStudents) {
// //			
// //			System.out.print(i + " ");
// //			
// //		}
// 		System.out.println("Succcessful Algorithm");
// 	}
// //	@Test
// //	public void testUserService() {
// //		System.out.println("TESTING USER SERVICE");
// //		us = new UserService();
// //		System.out.println("us: ");
// //	}
// }
