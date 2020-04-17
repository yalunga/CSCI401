package capstone.service;

import java.util.Collection;
import java.util.Vector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.model.assignment.Assignment;
import capstone.model.assignment.WeeklyReport;
import capstone.repository.WeeklyReportRepository;
import capstone.util.Constants;

@Service
public class AssignmentService {
    @Autowired
    private WeeklyReportRepository weeklyRepo; 

    public String getAssignmentType(Assignment a) {
        // Change return statements to constants
        if(a.getClass() == WeeklyReport.class) {
            return "WeeklyReport";
        }
        return Constants.EMPTY;
    }
    public void saveAssignment(Assignment a) {
		a.setAssignmentType(getAssignmentType(a));
		if (a.getClass() == WeeklyReport.class) {
			weeklyRepo.save((WeeklyReport) a);
		} 
    }

    public Collection<WeeklyReport> getWeeklyReports() {
        return weeklyRepo.findAll(); 
    }

}