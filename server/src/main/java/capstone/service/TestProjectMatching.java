package capstone.service;

import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import capstone.model.Project;
import capstone.model.users.Student;


public class TestProjectMatching {
	@Autowired
	ProjectService ps;
	
	@Test
	public void testAlgorithm() {
		System.out.println("TEST ALGORITHM");
		ps = new ProjectService();
		ps.initTables();
		List<Project> alg = ps.runAlgorithm();
		for (Project p : alg) {
			System.out.println("Project " + p.getProjectId());
			System.out.print("Students:");
			for (Student s: p.getMembers()) {
				System.out.print(" "+s.getLastName());
			}
			System.out.println("");
		}
		
		System.out.println("Succcessful Algorithm");
	}
}
