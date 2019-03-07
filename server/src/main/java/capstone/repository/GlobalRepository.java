package capstone.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import capstone.model.Global;

public interface GlobalRepository extends JpaRepository<Global, Long> 
{
	// this is always 1
	List<Global> findAll();
	Global findById(int i);
}

