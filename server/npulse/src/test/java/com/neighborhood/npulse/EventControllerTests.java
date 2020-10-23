package com.neighborhood.npulse;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class EventControllerTests {
    @LocalServerPort
    private int port;
    private String url = "http://localhost:"+port+"/";

    @Autowired
    private TestRestTemplate restTemplate;
    @Test
    public void rootUrlShouldReturnBulkEvents() throws Exception{
        assertThat(this.restTemplate.getForObject(url,String.class)).contains("");
    }
}
