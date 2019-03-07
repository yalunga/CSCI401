package capstone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import capstone.model.AdminConfiguration;
import capstone.model.Global;
import capstone.repository.AdminConfigurationRepository;
import capstone.repository.GlobalRepository;

@RestController
@RequestMapping("/admin/configurations")
public class AdminConfigurationController {
	
	@Autowired
	private AdminConfigurationRepository acRepository;
	@Autowired
	private GlobalRepository globalRepo;
	
	@PostMapping("/save")
	@CrossOrigin
	public AdminConfiguration saveConfigurations(@RequestBody AdminConfiguration adminConfig) {
		acRepository.deleteAll();
		System.out.println("Date one: " + adminConfig.deliverableOneDate.toString());
		System.out.println("Number of ranked projects: " + adminConfig.numRankedProjects);
		return acRepository.save(adminConfig);
	}
	
	@GetMapping("/{semester}/{fallspring}")
	@CrossOrigin
	public void SetSemester(@PathVariable("semester") int semester, @PathVariable("fallspring") int fallspring) 
	{
		Global g = globalRepo.findAll().get(0);
		g.setSemester(semester);
		g.setFallSpring(fallspring);
		globalRepo.save(g);
	}
	
	@GetMapping("/globalData")
	@CrossOrigin
	public Global getGlobalData() 
	{
		Global g = globalRepo.findAll().get(0);
		return g;
	}
	
	@GetMapping("/current")
	@CrossOrigin
	public AdminConfiguration getConfiguration() {
		Long currentId = (long) 1;
		return acRepository.findOne(currentId);
	}
}
