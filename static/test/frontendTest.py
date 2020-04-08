import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time

'''
# TODO1: when logged in, login and register button under settings will disappear
# TODO2: when logged in, name of user should appear
# TODO3: register a test account -> test sign in
# TODO4: next to the word president has a comma, it is clickable to login with admin
'''


class frontendTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def username_password(self, username_input, password_input):
        driver = self.driver
        driver.get("https://alpha-holding.herokuapp.com/")
        time.sleep(3)

        # get icon for chat
        chat_icon = driver.find_element_by_class_name("toggle-chat-btn")
        chat_icon.click()
        time.sleep(3)

        # check whether the when the chat icon is pressed, the style should change
        assert int(driver.find_elements_by_css_selector(
            '.chat')[0].value_of_css_property('opacity')) == 1
        time.sleep(3)

        # click for card replacement
        card_replacement = driver.find_element_by_xpath(
            '//*[@id="1"]')
        card_replacement.click()
        time.sleep(3)

        # click for yes please
        yes_please = driver.find_element_by_xpath(
            '//*[@id="cd-0"]')
        yes_please.click()
        time.sleep(3)

        # click to sign in
        sign_in = driver.find_element_by_xpath(
            '//*[@id="resignin-5"]')
        sign_in.click()
        time.sleep(3)

        # enter username and password
        username = driver.find_element_by_id("usernameInput")
        password = driver.find_element_by_id("passwordInput")
        time.sleep(3)

        username.send_keys(username_input)
        password.send_keys(password_input)
        time.sleep(3)

        driver.find_element_by_id("login_btn").click()
        time.sleep(3)

        alert = driver.find_element_by_xpath('//*[@id="alertLogin"]')
        time.sleep(3)

        # register button, as register button will appear if user is not registered
        if alert is not None:
            pass
        else:
            assert driver.find_element_by_id('signInRegisterBtn') is not None
            driver.find_element_by_id('signInRegisterBtn').click()
            assert str(driver.find_elements_by_css_selector(
                '.modal')[0].value_of_css_property('display')) == 'block'

    def test_username_password1(self):
        self.username_password('test1', 'test1')

    def test_username_password2(self):
        self.username_password('', '')

    def test_username_password3(self):
        self.username_password('&ssomething', '%d1234')

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
