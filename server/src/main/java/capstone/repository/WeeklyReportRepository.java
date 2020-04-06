package capstone.repository;

import javax.transaction.Transactional;

import capstone.model.assignment.WeeklyReport;

@Transactional
public interface WeeklyReportRepository extends AssignmentBaseRepository<WeeklyReport> {
    
}
