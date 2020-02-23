package capstone.service;

import java.util.Collections;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import capstone.model.Project;
import capstone.model.users.Student;


public class TestProjectMatching {
	@Autowired
	ProjectService ps;
	UserService us;
	
	@Test
	public void testAlgorithm() {
		System.out.println("TEST ALGORITHM");
		ps = new ProjectService();
		ps.initTables();
		List<Project> alg = ps.runAlgorithm();
		Collections.sort(alg);
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
//	@Test
//	public void testUserService() {
//		System.out.println("TESTING USER SERVICE");
//		us = new UserService();
//		System.out.println("us: ");
//	}
}
