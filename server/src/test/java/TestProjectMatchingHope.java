import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import capstone.model.Project;
import capstone.model.users.Student;
import capstone.service.ProjectService;


public class TestProjectMatchingHope {
	@Autowired
	ProjectService ps;
	
	@Test
	public void testAlgorithm() {
		System.out.println("TEST ALGORITHM");
		ps = new ProjectService();
		ps.initTables();
		// List<Project> alg = ps.runAlgorithm();
		// for (Project p : alg) {
		// 	for (Student s: p.getMembers()) {
		// 		System.out.print(" "+s.getLastName());
		// 	}
		// 	System.out.println("");
		// }

		//ps.runBruteForceAlgorithm();
		
		System.out.println("Succcessful Algorithm");
	}
}
