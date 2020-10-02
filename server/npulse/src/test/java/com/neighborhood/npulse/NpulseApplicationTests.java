package com.neighborhood.npulse;
import static org.assertj.core.api.Assertions.assertThat;
import com.neighborhood.npulse.web.EventController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
@SpringBootTest
class NpulseApplicationTests {
    @Autowired
    private EventController controller;
    @Test
    void contextLoads() throws Exception {
        assertThat(controller).isNotNull();
    }

}
